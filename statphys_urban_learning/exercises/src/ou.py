"""
Ornstein–Uhlenbeck (OU) process utilities for M9.

OU SDE:
    dX = theta*(mu - X) dt + sigma dW

Stationary distribution (theta > 0):
    mean = mu
    var  = sigma^2 / (2*theta)
    autocorr(tau) = exp(-theta*tau)
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Optional

import numpy as np


@dataclass
class OUTrace:
    t: np.ndarray
    x: np.ndarray


def stationary_variance(theta: float, sigma: float) -> float:
    if theta <= 0:
        raise ValueError("theta must be > 0 for a stationary OU process")
    return float(sigma**2 / (2.0 * theta))


def simulate_ou(
    *,
    theta: float = 1.0,
    mu: float = 0.0,
    sigma: float = 1.0,
    x0: float = 0.0,
    dt: float = 1e-3,
    n_steps: int = 20000,
    seed: int = 0,
) -> OUTrace:
    """Euler–Maruyama simulation of OU process."""
    if dt <= 0:
        raise ValueError("dt must be positive")
    if n_steps <= 1:
        raise ValueError("n_steps must be > 1")
    if theta <= 0:
        raise ValueError("theta must be > 0 for mean reversion")

    rng = np.random.default_rng(seed)
    x = np.empty(n_steps, dtype=float)
    t = np.arange(n_steps, dtype=float) * dt
    x[0] = float(x0)

    sqrt_dt = np.sqrt(dt)
    for k in range(1, n_steps):
        drift = theta * (mu - x[k - 1])
        noise = sigma * sqrt_dt * rng.normal()
        x[k] = x[k - 1] + drift * dt + noise

    return OUTrace(t=t, x=x)
