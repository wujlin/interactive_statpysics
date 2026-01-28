"""Diffusion / random-walk utilities for P04.

Conventions:
- Discrete-time Markov chain with row-stochastic transition matrix P.
- Distributions are row vectors p such that p_{t+1} = p_t P.
"""

from __future__ import annotations

import numpy as np


def build_grid_transition(grid: int, stay: float = 0.5, *, periodic: bool = True) -> np.ndarray:
    """Return a lazy random-walk transition matrix on a 2D grid.

    Nodes are indexed by (x,y) with 0<=x,y<grid and flattened as i = y*grid + x.

    The walk is "lazy" to avoid bipartite oscillations:
      - stay at current node with probability `stay`
      - move to a (4-neighbor) node with the remaining probability, split equally.

    If `periodic=True`, the grid is a torus (degree=4 everywhere), and the uniform
    distribution is stationary.
    """

    if grid <= 1:
        raise ValueError("grid must be >= 2")
    stay = float(stay)
    if not (0.0 <= stay < 1.0):
        raise ValueError("stay must satisfy 0 <= stay < 1")

    n = grid * grid
    P = np.zeros((n, n), dtype=float)
    move = 1.0 - stay

    def idx(x: int, y: int) -> int:
        return y * grid + x

    for y in range(grid):
        for x in range(grid):
            i = idx(x, y)
            P[i, i] = stay

            neigh: list[int] = []
            if periodic:
                neigh = [
                    idx((x - 1) % grid, y),
                    idx((x + 1) % grid, y),
                    idx(x, (y - 1) % grid),
                    idx(x, (y + 1) % grid),
                ]
            else:
                if x > 0:
                    neigh.append(idx(x - 1, y))
                if x < grid - 1:
                    neigh.append(idx(x + 1, y))
                if y > 0:
                    neigh.append(idx(x, y - 1))
                if y < grid - 1:
                    neigh.append(idx(x, y + 1))

            if len(neigh) == 0:
                raise RuntimeError("grid neighbor construction failed")
            w = move / len(neigh)
            for j in neigh:
                P[i, j] += w

    if not np.allclose(P.sum(axis=1), 1.0, atol=1e-12):
        raise RuntimeError("constructed P is not row-stochastic")
    if np.min(P) < -1e-15:
        raise RuntimeError("constructed P has negative probabilities")
    return P


def evolve(p0: np.ndarray, P: np.ndarray, steps: int) -> np.ndarray:
    """Evolve distribution p_{t+1}=p_t P for a given number of steps."""

    p = np.asarray(p0, dtype=float)
    if p.ndim != 1:
        raise ValueError("p0 must be a 1D row vector")
    P = np.asarray(P, dtype=float)
    if P.ndim != 2 or P.shape[0] != P.shape[1]:
        raise ValueError("P must be square")
    if p.shape[0] != P.shape[0]:
        raise ValueError("p0 and P shape mismatch")
    if steps < 0:
        raise ValueError("steps must be >= 0")
    if not np.allclose(P.sum(axis=1), 1.0, atol=1e-10):
        raise ValueError("Rows of P must sum to 1")
    if np.any(p < -1e-15):
        raise ValueError("p0 must be nonnegative")

    s = float(p.sum())
    if s <= 0:
        raise ValueError("p0 must have positive mass")
    p = p / s

    for _ in range(int(steps)):
        p = p @ P
    return p


def total_variation(p: np.ndarray, q: np.ndarray) -> float:
    """Total variation distance: TV(p,q)=0.5*sum_i |p_i-q_i|."""

    p = np.asarray(p, dtype=float)
    q = np.asarray(q, dtype=float)
    if p.shape != q.shape:
        raise ValueError("p and q must have the same shape")
    return float(0.5 * np.sum(np.abs(p - q)))


def uniform(n: int) -> np.ndarray:
    """Uniform distribution over n states."""

    if n <= 0:
        raise ValueError("n must be >= 1")
    return np.ones(n, dtype=float) / n

