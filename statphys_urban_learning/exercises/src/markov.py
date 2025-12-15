"""
Small Markov-chain utilities used in M8.

Conventions:
- Transition matrix P is row-stochastic: rows sum to 1.
- Stationary distribution pi is a row vector such that pi = pi P.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Optional

import numpy as np


def stationary_distribution(P: np.ndarray) -> np.ndarray:
    """
    Compute stationary distribution pi for a row-stochastic transition matrix P.

    Uses eigenvector of P^T with eigenvalue 1, then normalizes to sum to 1.
    """
    P = np.asarray(P, dtype=float)
    if P.ndim != 2 or P.shape[0] != P.shape[1]:
        raise ValueError("P must be a square matrix")
    n = P.shape[0]

    # Basic sanity: rows sum to 1 (within tolerance)
    if not np.allclose(P.sum(axis=1), 1.0, atol=1e-10):
        raise ValueError("Rows of P must sum to 1 (row-stochastic)")

    w, v = np.linalg.eig(P.T)
    # pick eigenvalue closest to 1
    idx = int(np.argmin(np.abs(w - 1.0)))
    vec = np.real(v[:, idx])

    # Make non-negative (sign ambiguity)
    vec = np.abs(vec)

    if vec.sum() == 0:
        raise ValueError("Failed to compute a non-zero stationary vector")

    pi = vec / vec.sum()

    # polish by power iteration a bit (helps numerical stability)
    for _ in range(50):
        pi = pi @ P
        pi = pi / pi.sum()

    return pi


def net_flux(P: np.ndarray, pi: Optional[np.ndarray] = None) -> np.ndarray:
    """
    Compute net flux matrix J_ij = pi_i P_ij - pi_j P_ji.
    """
    P = np.asarray(P, dtype=float)
    if pi is None:
        pi = stationary_distribution(P)
    else:
        pi = np.asarray(pi, dtype=float)
        pi = pi / pi.sum()

    J = pi[:, None] * P - pi[None, :] * P.T
    return J


def detailed_balance_violation(P: np.ndarray, pi: Optional[np.ndarray] = None) -> float:
    """
    Return a scalar measure of detailed balance violation:
        ||J||_1 / 2  (sum of absolute net flux / 2)
    where J is the net flux matrix.

    0 means detailed balance holds.
    """
    J = net_flux(P, pi=pi)
    return float(0.5 * np.sum(np.abs(J)))
