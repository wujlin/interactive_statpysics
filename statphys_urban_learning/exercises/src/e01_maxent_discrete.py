"""
E01: Discrete maximum entropy solver (linear constraints).

We solve:
    maximize  H(p) = -sum_i p_i log p_i
subject to:
    sum_i p_i = 1
    E_p[f_k(x)] = c_k  for k=1..K

Solution:
    p_i(λ) ∝ exp(- Σ_k λ_k f_k(x_i))

We find λ by Newton iterations on g(λ)=E_p[f]-c = 0.
Jacobian: dg/dλ = -Cov_p(f)  (positive semidefinite).
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Tuple

import numpy as np


@dataclass
class MaxEntResult:
    """Result of max-entropy fitting."""
    p: np.ndarray               # shape (n,)
    lambdas: np.ndarray         # shape (K,)
    moments: np.ndarray         # E_p[f], shape (K,)
    converged: bool
    n_iter: int
    max_abs_constraint_error: float


def _logsumexp(a: np.ndarray) -> float:
    """Stable log(sum(exp(a)))."""
    a = np.asarray(a, dtype=float)
    m = np.max(a)
    return float(m + np.log(np.sum(np.exp(a - m))))


def maxent_from_moments(
    F: np.ndarray,
    targets: np.ndarray,
    *,
    max_iter: int = 100,
    tol: float = 1e-10,
    damping: float = 1.0,
    ridge: float = 1e-12,
    init_lambdas: np.ndarray | None = None,
) -> MaxEntResult:
    """
    Fit a discrete max-entropy distribution with linear expectation constraints.

    Parameters
    ----------
    F:
        Feature matrix of shape (n, K), where F[i,k] = f_k(x_i).
    targets:
        Target moments c of shape (K,).
    max_iter:
        Maximum Newton iterations.
    tol:
        Convergence tolerance on max absolute constraint error.
    damping:
        Step size multiplier in (0,1]; can reduce if Newton overshoots.
    ridge:
        Small diagonal added to covariance for numerical stability.
    init_lambdas:
        Optional initial lambdas. Default: zeros.

    Returns
    -------
    MaxEntResult
    """
    F = np.asarray(F, dtype=float)
    targets = np.asarray(targets, dtype=float)

    if F.ndim != 2:
        raise ValueError("F must be 2D array of shape (n, K)")
    n, K = F.shape
    if targets.shape != (K,):
        raise ValueError(f"targets must have shape ({K},)")

    lam = np.zeros(K, dtype=float) if init_lambdas is None else np.asarray(init_lambdas, dtype=float).copy()
    if lam.shape != (K,):
        raise ValueError(f"init_lambdas must have shape ({K},)")

    converged = False
    moments = np.zeros(K, dtype=float)

    for it in range(1, max_iter + 1):
        # log weights: -F @ lam
        logw = -(F @ lam)
        # normalize stably
        logZ = _logsumexp(logw)
        p = np.exp(logw - logZ)

        # moments and residual
        moments = p @ F  # shape (K,)
        g = moments - targets
        err = float(np.max(np.abs(g)))

        if err < tol:
            converged = True
            return MaxEntResult(
                p=p,
                lambdas=lam,
                moments=moments,
                converged=True,
                n_iter=it,
                max_abs_constraint_error=err,
            )

        # Cov(F): E[ff^T] - E[f]E[f]^T
        FF = (F.T * p) @ F  # shape (K,K) ; uses broadcasting
        cov = FF - np.outer(moments, moments)

        # Stabilize and solve: dg/dlam = -cov  => Newton: lam <- lam + cov^{-1} g
        cov_reg = cov + ridge * np.eye(K)
        try:
            delta = np.linalg.solve(cov_reg, g)
        except np.linalg.LinAlgError:
            # fall back to least squares
            delta = np.linalg.lstsq(cov_reg, g, rcond=None)[0]

        lam = lam + damping * delta

    # final evaluate
    logw = -(F @ lam)
    logZ = _logsumexp(logw)
    p = np.exp(logw - logZ)
    moments = p @ F
    err = float(np.max(np.abs(moments - targets)))
    return MaxEntResult(
        p=p,
        lambdas=lam,
        moments=moments,
        converged=converged,
        n_iter=max_iter,
        max_abs_constraint_error=err,
    )
