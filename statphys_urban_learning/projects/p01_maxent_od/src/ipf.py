"""
IPF (Iterative Proportional Fitting) / RAS algorithm for fitting a nonnegative matrix
to given row/column sums.

This is exactly the maximum-entropy solution under row/column marginal constraints
when the prior matrix is uniform (or more generally, when fitting to a given prior).
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Optional, Tuple

import numpy as np


@dataclass
class IPFResult:
    T: np.ndarray
    n_iter: int
    row_err: float
    col_err: float


def _safe_divide(a: np.ndarray, b: np.ndarray, eps: float = 1e-12) -> np.ndarray:
    return a / (b + eps)


def ipf(
    prior: np.ndarray,
    row_sums: np.ndarray,
    col_sums: np.ndarray,
    max_iter: int = 10_000,
    tol: float = 1e-10,
    eps: float = 1e-12,
) -> IPFResult:
    """
    Fit matrix T to row_sums and col_sums by scaling rows/cols iteratively.

    Args:
        prior: nonnegative matrix (m, n) as initial guess / prior structure.
        row_sums: target row sums (m,)
        col_sums: target col sums (n,)
        max_iter: maximum iterations
        tol: stop when max relative error < tol
        eps: numerical epsilon

    Returns:
        IPFResult with fitted matrix and errors.

    Notes:
        - Requires sum(row_sums) == sum(col_sums) (within tolerance).
        - If prior has zeros, those entries remain zero (structural zeros).
    """
    prior = np.asarray(prior, dtype=float)
    if prior.ndim != 2:
        raise ValueError("prior must be a 2D array")
    if np.any(prior < 0):
        raise ValueError("prior must be nonnegative")

    m, n = prior.shape
    row_sums = np.asarray(row_sums, dtype=float).reshape(-1)
    col_sums = np.asarray(col_sums, dtype=float).reshape(-1)

    if row_sums.shape[0] != m:
        raise ValueError("row_sums shape mismatch")
    if col_sums.shape[0] != n:
        raise ValueError("col_sums shape mismatch")
    if np.any(row_sums < 0) or np.any(col_sums < 0):
        raise ValueError("target sums must be nonnegative")

    total_row = float(row_sums.sum())
    total_col = float(col_sums.sum())
    if not np.isfinite(total_row) or not np.isfinite(total_col):
        raise ValueError("target sums must be finite")
    if abs(total_row - total_col) > 1e-8 * max(1.0, total_row, total_col):
        raise ValueError("sum(row_sums) must equal sum(col_sums)")

    # Initialize
    T = prior.copy()

    # If prior is all zeros but targets nonzero => impossible
    if T.sum() <= eps and total_row > eps:
        raise ValueError("prior has no support (all zeros) but targets are nonzero")

    for it in range(1, max_iter + 1):
        # Row scaling
        current_row = T.sum(axis=1)
        row_factor = _safe_divide(row_sums, current_row, eps=eps)
        T = (T.T * row_factor).T

        # Col scaling
        current_col = T.sum(axis=0)
        col_factor = _safe_divide(col_sums, current_col, eps=eps)
        T = T * col_factor

        # Check error
        current_row = T.sum(axis=1)
        current_col = T.sum(axis=0)

        row_rel_err = np.max(np.abs(current_row - row_sums) / (row_sums + eps))
        col_rel_err = np.max(np.abs(current_col - col_sums) / (col_sums + eps))
        err = max(row_rel_err, col_rel_err)

        if err < tol:
            return IPFResult(T=T, n_iter=it, row_err=float(row_rel_err), col_err=float(col_rel_err))

    return IPFResult(T=T, n_iter=max_iter, row_err=float(row_rel_err), col_err=float(col_rel_err))


def maxent_od(
    row_sums: np.ndarray,
    col_sums: np.ndarray,
    prior: Optional[np.ndarray] = None,
    **kwargs,
) -> IPFResult:
    """
    Convenience wrapper:
        - If prior is None, use uniform prior (all ones).
        - Return IPFResult.

    This corresponds to the maximum entropy OD matrix with only row/col constraints.
    """
    row_sums = np.asarray(row_sums, dtype=float)
    col_sums = np.asarray(col_sums, dtype=float)
    m = row_sums.size
    n = col_sums.size
    if prior is None:
        prior = np.ones((m, n), dtype=float)
    return ipf(prior=prior, row_sums=row_sums, col_sums=col_sums, **kwargs)
