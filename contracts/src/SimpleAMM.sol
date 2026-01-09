// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";

/**
 * @title SimpleAMM
 * @dev A simplified Constant Product Market Maker (x * y = k) for trading AssetTokens.
 *      Allows secondary market liquidity for permissioned AssetTokens.
 */
contract SimpleAMM is Ownable {
    IERC20 public immutable token0; // Payment Token (e.g. USDC)
    IERC20 public immutable token1; // Asset Token
    
    uint256 public reserve0;
    uint256 public reserve1;
    
    uint256 public totalLiquidityShares;
    mapping(address => uint256) public liquidityShares;
    
    event Mint(address indexed sender, uint256 amount0, uint256 amount1);
    event Burn(address indexed sender, uint256 amount0, uint256 amount1);
    event Swap(address indexed sender, uint256 amountIn, address tokenIn, uint256 amountOut);
    event Sync(uint256 reserve0, uint256 reserve1);

    constructor(address _token0, address _token1) Ownable(msg.sender) {
        token0 = IERC20(_token0);
        token1 = IERC20(_token1);
    }

    /**
     * @dev Add liquidity to the pool. Initial ratio sets the price.
     */
    function addLiquidity(uint256 amount0, uint256 amount1) external returns (uint256 shares) {
        token0.transferFrom(msg.sender, address(this), amount0);
        token1.transferFrom(msg.sender, address(this), amount1);
        
        uint256 bal0 = token0.balanceOf(address(this));
        uint256 bal1 = token1.balanceOf(address(this));
        
        uint256 d0 = bal0 - reserve0;
        uint256 d1 = bal1 - reserve1;
        
        if (totalLiquidityShares == 0) {
            shares = d0 + d1; // Initial simplified share calculation
        } else {
            uint256 share0 = (d0 * totalLiquidityShares) / reserve0;
            uint256 share1 = (d1 * totalLiquidityShares) / reserve1;
            shares = share0 < share1 ? share0 : share1;
        }
        
        require(shares > 0, "No shares minted");
        
        liquidityShares[msg.sender] += shares;
        totalLiquidityShares += shares;
        
        _update(bal0, bal1);
        emit Mint(msg.sender, d0, d1);
    }
    
    /**
     * @dev Remove liquidity from the pool.
     */
    function removeLiquidity(uint256 shares) external returns (uint256 amount0, uint256 amount1) {
        require(shares > 0, "Shares = 0");
        
        uint256 bal0 = token0.balanceOf(address(this));
        uint256 bal1 = token1.balanceOf(address(this));
        
        amount0 = (shares * bal0) / totalLiquidityShares;
        amount1 = (shares * bal1) / totalLiquidityShares;
        
        require(amount0 > 0 && amount1 > 0, "Amount 0");
        
        liquidityShares[msg.sender] -= shares;
        totalLiquidityShares -= shares;
        
        token0.transfer(msg.sender, amount0);
        token1.transfer(msg.sender, amount1);
        
        _update(token0.balanceOf(address(this)), token1.balanceOf(address(this)));
        emit Burn(msg.sender, amount0, amount1);
    }

    /**
     * @dev Swap exact input of one token for the other.
     */
    function swap(address _tokenIn, uint256 _amountIn) external returns (uint256 amountOut) {
        require(_tokenIn == address(token0) || _tokenIn == address(token1), "Invalid token");
        require(_amountIn > 0, "Amount in = 0");
        
        bool isToken0 = _tokenIn == address(token0);
        
        (IERC20 tIn, IERC20 tOut, uint256 resIn, uint256 resOut) = isToken0 
            ? (token0, token1, reserve0, reserve1) 
            : (token1, token0, reserve1, reserve0);
            
        tIn.transferFrom(msg.sender, address(this), _amountIn);
        
        // Calculate amount out with 0.3% fee
        uint256 amountInWithFee = _amountIn * 997;
        uint256 numerator = amountInWithFee * resOut;
        uint256 denominator = (resIn * 1000) + amountInWithFee;
        amountOut = numerator / denominator;
        
        require(amountOut > 0, "Insufficient output");
        
        tOut.transfer(msg.sender, amountOut);
        
        _update(token0.balanceOf(address(this)), token1.balanceOf(address(this)));
        emit Swap(msg.sender, _amountIn, _tokenIn, amountOut);
    }

    function _update(uint256 bal0, uint256 bal1) private {
        reserve0 = bal0;
        reserve1 = bal1;
        emit Sync(reserve0, reserve1);
    }
}
