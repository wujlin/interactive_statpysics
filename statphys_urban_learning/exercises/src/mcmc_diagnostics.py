"""
Minimal MCMC diagnostics: autocorrelation time and effective sample size (ESS).

This is intentionally lightweight and dependency-free (NumPy only).
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Optional

import numpy as np


@dataclass
class MCMCDiagnostics:
    tau_int: float
    ess: float
    max_lag_used: int


def autocorrelation(x: np.ndarray, max_lag: Optional[int] = None) -> np.ndarray:
    """
    Estimate normalized autocorrelation function rho(lag) for lag=0..max_lag.

    Uses FFT for O(n log n) complexity.
    """
    x = np.asarray(x, dtype=float)
    if x.ndim != 1:
        raise ValueError("x must be 1D")
    n = x.size
    if n < 2:
        raise ValueError("x must have length >= 2")

    if max_lag is None:
        max_lag = n - 1
    max_lag = int(max_lag)
    if max_lag < 0:
        raise ValueError("max_lag must be >= 0")
    max_lag = min(max_lag, n - 1)

    x = x - x.mean()
    var = np.dot(x, x) / n
    if var == 0.0:
        # constant chain: rho(0)=1, others 0 by convention
        rho = np.zeros(max_lag + 1, dtype=float)
        rho[0] = 1.0
        return rho

    # FFT-based autocovariance
    # zero-pad to 2n for circular convolution avoidance
    m = 1 << (2 * n - 1).bit_length()
    fx = np.fft.rfft(x, n=m)
    acov = np.fft.irfft(fx * np.conjugate(fx), n=m)[: n] / n

    rho_full = acov / var
    return rho_full[: max_lag + 1]


def integrated_autocorr_time(x: np.ndarray, max_lag: Optional[int] = None) -> MCMCDiagnostics:
    """
    Compute integrated autocorrelation time (tau_int) and ESS.

    We use the initial positive sequence heuristic:
    sum rho(lag) until the first lag where rho becomes negative.
    """
    x = np.asarray(x, dtype=float)
    n = x.size
    if max_lag is None:
        # A common heuristic: consider up to n/2 lags at most
        max_lag = min(n - 1, max(1, n // 2))
    rho = autocorrelation(x, max_lag=max_lag)

    # initial positive sequence (skip lag=0)
    cutoff = max_lag
    for lag in range(1, rho.size):
        if rho[lag] < 0.0:
            cutoff = lag - 1
            break
    if cutoff < 1:
        tau = 1.0
    else:
        tau = 1.0 + 2.0 * float(np.sum(rho[1 : cutoff + 1]))

    ess = float(n / tau) if tau > 0 else 0.0
    return MCMCDiagnostics(tau_int=tau, ess=ess, max_lag_used=cutoff)


def effective_sample_size(x: np.ndarray, max_lag: Optional[int] = None) -> float:
    """Convenience wrapper: return ESS only."""
    return integrated_autocorr_time(x, max_lag=max_lag).ess
