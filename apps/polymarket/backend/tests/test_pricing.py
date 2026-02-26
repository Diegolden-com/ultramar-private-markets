import math

import pytest

from backend.pricing.black_scholes import call_price, gamma, put_price, vega
from backend.pricing.probabilities import prob_above_strike
from backend.signals.implied_prob import implied_prob_mid


def test_prob_above_strike_basic():
    p = prob_above_strike(S=110, K=100, T=1.0, r=0.05, sigma=0.5)
    assert p > 0.5


def test_implied_prob_mid():
    bids = [{"price": "0.40", "size": 100}]
    asks = [{"price": "0.60", "size": 100}]
    assert implied_prob_mid(bids, asks) == 0.50


def test_implied_prob_empty():
    assert implied_prob_mid([], []) is None


def test_black_scholes_prices_and_greeks():
    S = 100.0
    K = 100.0
    T = 1.0
    r = 0.01
    sigma = 0.2
    call = call_price(S, K, T, r, sigma)
    put = put_price(S, K, T, r, sigma)
    assert call > 0
    assert put > 0
    assert call - put == pytest.approx(S - K * math.exp(-r * T), rel=1e-3)
    assert vega(S, K, T, r, sigma) > 0
    assert gamma(S, K, T, r, sigma) > 0
