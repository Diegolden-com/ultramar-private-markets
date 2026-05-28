// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AccessControl} from "openzeppelin-contracts/contracts/access/AccessControl.sol";
import {ECDSA} from "openzeppelin-contracts/contracts/utils/cryptography/ECDSA.sol";
import {MessageHashUtils} from "openzeppelin-contracts/contracts/utils/cryptography/MessageHashUtils.sol";
import {SolvencyRegistry} from "./SolvencyRegistry.sol";

/**
 * @title CapitalWindowRegistry
 * @dev Schedules approved primary conversion and secondary liquidity windows for the v4 custom-accounting hook.
 */
contract CapitalWindowRegistry is AccessControl {
    using MessageHashUtils for bytes32;

    enum WindowMode {
        PrimaryConversion,
        SecondaryLiquidity
    }

    struct WindowConfig {
        WindowMode mode;
        address paymentToken;
        address companyToken;
        address cashRecipient;
        address oracleSubject;
        uint64 startTime;
        uint64 endTime;
        uint256 totalCap;
        uint256 perInvestorCap;
        uint256 minTicket;
        uint256 maxTicket;
        uint256 basePrice;
        uint256 stepSize;
        uint16 stepPriceBps;
        uint64 oracleFreshness;
        int256 minSolvencyRatio;
        uint256 minLiquidityRatio;
        bool active;
    }

    struct WindowStatus {
        WindowConfig config;
        uint256 filled;
        bool paused;
        bool closed;
    }

    struct ExecutionResult {
        WindowMode mode;
        address paymentToken;
        address companyToken;
        address cashRecipient;
        uint256 companyTokenAmount;
        uint256 effectivePrice;
        uint256 filledAfter;
    }

    bytes32 public constant COUNSEL_ROLE = keccak256("COUNSEL_ROLE");
    bytes32 public constant AUTHORIZER_ROLE = keccak256("AUTHORIZER_ROLE");
    bytes32 public constant HOOK_ROLE = keccak256("HOOK_ROLE");

    uint256 public constant PRICE_SCALE = 1e18;
    uint256 public constant BPS = 10_000;
    uint256 public constant MAX_STEP_ITERATIONS = 256;

    SolvencyRegistry public immutable solvencyRegistry;
    uint256 public nextWindowId = 1;

    mapping(uint256 => WindowConfig) private windows;
    mapping(uint256 => uint256) public windowFilled;
    mapping(uint256 => bool) public windowPaused;
    mapping(uint256 => bool) public windowClosed;
    mapping(uint256 => mapping(address => bool)) public investorEligible;
    mapping(uint256 => mapping(address => uint256)) public investorLimit;
    mapping(uint256 => mapping(address => uint256)) public investorFilled;
    mapping(bytes32 => bool) public authorizationUsed;

    event WindowCreated(uint256 indexed windowId, WindowMode indexed mode, address paymentToken, address companyToken);
    event WindowActiveUpdated(uint256 indexed windowId, bool active);
    event WindowPausedUpdated(uint256 indexed windowId, bool paused);
    event WindowClosed(uint256 indexed windowId);
    event InvestorLimitUpdated(uint256 indexed windowId, address indexed investor, bool eligible, uint256 limit);
    event WindowConsumed(
        uint256 indexed windowId,
        address indexed investor,
        WindowMode indexed mode,
        uint256 paymentAmount,
        uint256 companyTokenAmount,
        uint256 filledAfter
    );

    error WindowNotFound(uint256 windowId);
    error InvalidWindowConfig();
    error WindowInactive(uint256 windowId);
    error WindowPaused(uint256 windowId);
    error WindowAlreadyClosed(uint256 windowId);
    error WindowNotOpen(uint256 windowId);
    error TicketTooSmall(uint256 amountPayment);
    error TicketTooLarge(uint256 amountPayment);
    error TotalCapExceeded(uint256 windowId);
    error InvestorCapExceeded(uint256 windowId, address investor);
    error InvestorNotEligible(uint256 windowId, address investor);
    error AuthorizationExpired(uint256 deadline);
    error AuthorizationUsed(bytes32 digest);
    error InvalidAuthorization();
    error TokenMismatch();
    error StaleOracle(uint256 windowId);
    error OracleUnhealthy(uint256 windowId);
    error SlippageExceeded(uint256 quotedAmount, uint256 minimumAmount);
    error TooManyStepIterations(uint256 windowId);

    constructor(address admin, SolvencyRegistry _solvencyRegistry) {
        solvencyRegistry = _solvencyRegistry;
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(COUNSEL_ROLE, admin);
        _grantRole(AUTHORIZER_ROLE, admin);
    }

    function createWindow(WindowConfig calldata config) external onlyRole(COUNSEL_ROLE) returns (uint256 windowId) {
        _validateConfig(config);

        windowId = nextWindowId++;
        windows[windowId] = config;

        emit WindowCreated(windowId, config.mode, config.paymentToken, config.companyToken);
        emit WindowActiveUpdated(windowId, config.active);
    }

    function setWindowActive(uint256 windowId, bool active) external onlyRole(COUNSEL_ROLE) {
        WindowConfig storage config = _window(windowId);
        config.active = active;
        emit WindowActiveUpdated(windowId, active);
    }

    function setWindowPaused(uint256 windowId, bool paused) external onlyRole(COUNSEL_ROLE) {
        _window(windowId);
        windowPaused[windowId] = paused;
        emit WindowPausedUpdated(windowId, paused);
    }

    function closeWindow(uint256 windowId) external onlyRole(COUNSEL_ROLE) {
        _window(windowId);
        windowClosed[windowId] = true;
        emit WindowClosed(windowId);
    }

    function setInvestorLimit(uint256 windowId, address investor, bool eligible, uint256 limit)
        external
        onlyRole(COUNSEL_ROLE)
    {
        _window(windowId);
        investorEligible[windowId][investor] = eligible;
        investorLimit[windowId][investor] = limit;
        emit InvestorLimitUpdated(windowId, investor, eligible, limit);
    }

    function getWindow(uint256 windowId) external view returns (WindowStatus memory status) {
        WindowConfig memory config = _windowView(windowId);
        status = WindowStatus({
            config: config,
            filled: windowFilled[windowId],
            paused: windowPaused[windowId],
            closed: windowClosed[windowId]
        });
    }

    function authorizationDigest(
        uint256 windowId,
        address investor,
        address router,
        uint256 amountPayment,
        uint256 minCompanyTokens,
        uint256 deadline,
        uint256 nonce
    ) public view returns (bytes32) {
        return keccak256(
            abi.encode(
                "ULTRAMAR_CAPITAL_WINDOW",
                block.chainid,
                address(this),
                windowId,
                investor,
                router,
                amountPayment,
                minCompanyTokens,
                deadline,
                nonce
            )
        );
    }

    function authorizationMessageHash(
        uint256 windowId,
        address investor,
        address router,
        uint256 amountPayment,
        uint256 minCompanyTokens,
        uint256 deadline,
        uint256 nonce
    ) external view returns (bytes32) {
        return authorizationDigest(windowId, investor, router, amountPayment, minCompanyTokens, deadline, nonce)
            .toEthSignedMessageHash();
    }

    function quoteCompanyTokens(uint256 windowId, uint256 amountPayment)
        public
        view
        returns (uint256 companyTokenAmount, uint256 effectivePrice)
    {
        WindowConfig memory config = _windowView(windowId);
        companyTokenAmount = _quote(config, windowFilled[windowId], amountPayment, windowId);
        if (companyTokenAmount > 0) {
            effectivePrice = (amountPayment * PRICE_SCALE) / companyTokenAmount;
        }
    }

    function consumeWindow(
        uint256 windowId,
        address investor,
        address router,
        address paymentToken,
        address companyToken,
        uint256 amountPayment,
        uint256 minCompanyTokens,
        uint256 deadline,
        uint256 nonce,
        bytes calldata signature
    ) external onlyRole(HOOK_ROLE) returns (ExecutionResult memory result) {
        WindowConfig memory config = _windowView(windowId);
        _assertUsableWindow(windowId, config, investor, paymentToken, companyToken, amountPayment);
        _assertOracleHealthy(windowId, config);
        _verifyAuthorization(windowId, investor, router, amountPayment, minCompanyTokens, deadline, nonce, signature);

        uint256 companyTokenAmount = _quote(config, windowFilled[windowId], amountPayment, windowId);
        if (companyTokenAmount < minCompanyTokens) revert SlippageExceeded(companyTokenAmount, minCompanyTokens);

        result = _recordExecution(windowId, config, investor, amountPayment, companyTokenAmount);
    }

    function _recordExecution(
        uint256 windowId,
        WindowConfig memory config,
        address investor,
        uint256 amountPayment,
        uint256 companyTokenAmount
    ) internal returns (ExecutionResult memory result) {
        windowFilled[windowId] += amountPayment;
        investorFilled[windowId][investor] += amountPayment;
        uint256 effectivePrice = (amountPayment * PRICE_SCALE) / companyTokenAmount;

        result = ExecutionResult({
            mode: config.mode,
            paymentToken: config.paymentToken,
            companyToken: config.companyToken,
            cashRecipient: config.cashRecipient,
            companyTokenAmount: companyTokenAmount,
            effectivePrice: effectivePrice,
            filledAfter: windowFilled[windowId]
        });

        emit WindowConsumed(windowId, investor, config.mode, amountPayment, companyTokenAmount, result.filledAfter);
    }

    function _verifyAuthorization(
        uint256 windowId,
        address investor,
        address router,
        uint256 amountPayment,
        uint256 minCompanyTokens,
        uint256 deadline,
        uint256 nonce,
        bytes calldata signature
    ) internal {
        if (deadline < block.timestamp) revert AuthorizationExpired(deadline);

        bytes32 digest =
            authorizationDigest(windowId, investor, router, amountPayment, minCompanyTokens, deadline, nonce);
        if (authorizationUsed[digest]) revert AuthorizationUsed(digest);

        address signer = ECDSA.recover(digest.toEthSignedMessageHash(), signature);
        if (!hasRole(AUTHORIZER_ROLE, signer)) revert InvalidAuthorization();

        authorizationUsed[digest] = true;
    }

    function _assertUsableWindow(
        uint256 windowId,
        WindowConfig memory config,
        address investor,
        address paymentToken,
        address companyToken,
        uint256 amountPayment
    ) internal view {
        if (!config.active) revert WindowInactive(windowId);
        if (windowPaused[windowId]) revert WindowPaused(windowId);
        if (windowClosed[windowId]) revert WindowAlreadyClosed(windowId);
        if (block.timestamp < config.startTime || block.timestamp > config.endTime) revert WindowNotOpen(windowId);
        if (config.paymentToken != paymentToken || config.companyToken != companyToken) revert TokenMismatch();
        if (amountPayment < config.minTicket) revert TicketTooSmall(amountPayment);
        if (config.maxTicket > 0 && amountPayment > config.maxTicket) revert TicketTooLarge(amountPayment);
        if (windowFilled[windowId] + amountPayment > config.totalCap) revert TotalCapExceeded(windowId);
        if (!investorEligible[windowId][investor]) revert InvestorNotEligible(windowId, investor);

        uint256 cap = investorLimit[windowId][investor];
        if (cap == 0 || cap > config.perInvestorCap) cap = config.perInvestorCap;
        if (investorFilled[windowId][investor] + amountPayment > cap) {
            revert InvestorCapExceeded(windowId, investor);
        }
    }

    function _assertOracleHealthy(uint256 windowId, WindowConfig memory config) internal view {
        if (config.oracleFreshness == 0) return;

        SolvencyRegistry.SolvencyData memory data = solvencyRegistry.getLatestSolvency(config.oracleSubject);
        if (
            data.timestamp == 0 || data.timestamp > block.timestamp
                || block.timestamp - data.timestamp > config.oracleFreshness
        ) {
            revert StaleOracle(windowId);
        }

        if (data.solvencyRatio < config.minSolvencyRatio || data.liquidityRatio < config.minLiquidityRatio) {
            revert OracleUnhealthy(windowId);
        }
    }

    function _quote(WindowConfig memory config, uint256 filledBefore, uint256 amountPayment, uint256 windowId)
        internal
        pure
        returns (uint256 companyTokenAmount)
    {
        if (config.stepSize == 0 || config.stepPriceBps == 0) {
            return (amountPayment * PRICE_SCALE) / config.basePrice;
        }

        uint256 remaining = amountPayment;
        uint256 cursor = filledBefore;
        uint256 iterations;

        while (remaining > 0) {
            if (++iterations > MAX_STEP_ITERATIONS) revert TooManyStepIterations(windowId);

            uint256 stepIndex = cursor / config.stepSize;
            uint256 nextBoundary = (stepIndex + 1) * config.stepSize;
            uint256 tranchePayment = remaining;
            if (cursor + tranchePayment > nextBoundary) tranchePayment = nextBoundary - cursor;

            uint256 price = config.basePrice + ((config.basePrice * config.stepPriceBps * stepIndex) / BPS);
            companyTokenAmount += (tranchePayment * PRICE_SCALE) / price;

            cursor += tranchePayment;
            remaining -= tranchePayment;
        }
    }

    function _validateConfig(WindowConfig calldata config) internal pure {
        if (
            config.paymentToken == address(0) || config.companyToken == address(0) || config.cashRecipient == address(0)
                || config.oracleSubject == address(0) || config.startTime >= config.endTime || config.totalCap == 0
                || config.perInvestorCap == 0 || config.basePrice == 0
                || (config.maxTicket > 0 && config.minTicket > config.maxTicket)
        ) {
            revert InvalidWindowConfig();
        }
    }

    function _window(uint256 windowId) internal view returns (WindowConfig storage config) {
        config = windows[windowId];
        if (config.paymentToken == address(0)) revert WindowNotFound(windowId);
    }

    function _windowView(uint256 windowId) internal view returns (WindowConfig memory config) {
        config = windows[windowId];
        if (config.paymentToken == address(0)) revert WindowNotFound(windowId);
    }
}
