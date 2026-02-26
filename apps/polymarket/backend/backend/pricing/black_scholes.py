from __future__ import annotations

import math

from .cdf import normal_cdf, normal_pdf


def d1(S: float, K: float, T: float, r: float, sigma: float) -> float:
    return (math.log(S / K) + (r + 0.5 * sigma**2) * T) / (sigma * math.sqrt(T))


def d2(S: float, K: float, T: float, r: float, sigma: float) -> float:
    return d1(S, K, T, r, sigma) - sigma * math.sqrt(T)


def call_price(S: float, K: float, T: float, r: float, sigma: float) -> float:
    if T <= 0 or sigma <= 0:
        return max(S - K, 0.0)
    d1_val = d1(S, K, T, r, sigma)
    d2_val = d2(S, K, T, r, sigma)
    return S * normal_cdf(d1_val) - K * math.exp(-r * T) * normal_cdf(d2_val)


def put_price(S: float, K: float, T: float, r: float, sigma: float) -> float:
    if T <= 0 or sigma <= 0:
        return max(K - S, 0.0)
    d1_val = d1(S, K, T, r, sigma)
    d2_val = d2(S, K, T, r, sigma)
    return K * math.exp(-r * T) * normal_cdf(-d2_val) - S * normal_cdf(-d1_val)


def vega(S: float, K: float, T: float, r: float, sigma: float) -> float:
    if T <= 0 or sigma <= 0:
        return 0.0
    return S * normal_pdf(d1(S, K, T, r, sigma)) * math.sqrt(T)


def gamma(S: float, K: float, T: float, r: float, sigma: float) -> float:
    if T <= 0 or sigma <= 0:
        return 0.0
    return normal_pdf(d1(S, K, T, r, sigma)) / (S * sigma * math.sqrt(T))
