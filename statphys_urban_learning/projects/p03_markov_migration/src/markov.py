"""Markov migration project utilities.

Conventions:
- Transition matrix P is row-stochastic (rows sum to 1).
- Stationary distribution pi is a row vector such that pi = pi P.
"""

from __future__ import annotations

import numpy as np


def stationary_distribution(P: np.ndarray, tol: float = 1e-12, max_iter: int = 10000) -> np.ndarray:
    """Return stationary distribution π for row-stochastic P (discrete time) via power iteration."""
    P = np.asarray(P, dtype=float)
    if P.ndim != 2 or P.shape[0] != P.shape[1]:
        raise ValueError("P must be square")
    if not np.allclose(P.sum(axis=1), 1.0, atol=1e-10):
        raise ValueError("Rows of P must sum to 1")

    n = P.shape[0]
    pi = np.ones(n) / n
    for _ in range(max_iter):
        pi_next = pi @ P
        pi_next = pi_next / pi_next.sum()
        if np.linalg.norm(pi_next - pi, 1) < tol:
            return pi_next
        pi = pi_next
    raise RuntimeError("stationary_distribution did not converge")


def net_flux(P: np.ndarray, pi: np.ndarray | None = None) -> np.ndarray:
    """Net flux matrix J_ij = π_i P_ij - π_j P_ji."""
    P = np.asarray(P, dtype=float)
    if pi is None:
        pi = stationary_distribution(P)
    else:
        pi = np.asarray(pi, dtype=float)
        pi = pi / pi.sum()
    return pi[:, None] * P - pi[None, :] * P.T


def detailed_balance_violation(P: np.ndarray, pi: np.ndarray | None = None) -> float:
    """Scalar detailed-balance violation measure: 0.5 * sum_ij |J_ij|."""
    J = net_flux(P, pi=pi)
    return float(0.5 * np.sum(np.abs(J)))
