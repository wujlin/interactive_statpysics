"""
Minimal 2D Ising model simulation (single-spin flip Metropolis).

This is designed for educational use and small lattices, with deterministic seeding
for reproducible tests.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Tuple, Optional

import numpy as np


@dataclass
class IsingTrace:
    energy: np.ndarray        # per spin energy time series
    magnetization: np.ndarray # per spin magnetization time series
    spins: np.ndarray         # final spin configuration (L,L)


def initialize_spins(L: int, *, rng: Optional[np.random.Generator] = None) -> np.ndarray:
    """Random ±1 spin configuration."""
    if L <= 0:
        raise ValueError("L must be positive")
    rng = np.random.default_rng() if rng is None else rng
    spins = rng.choice([-1, 1], size=(L, L)).astype(np.int8)
    return spins


def energy(spins: np.ndarray, J: float = 1.0, h: float = 0.0) -> float:
    """Total energy with periodic boundary conditions."""
    s = spins.astype(float)
    # neighbor interactions: count each bond once
    right = np.roll(s, shift=-1, axis=1)
    down = np.roll(s, shift=-1, axis=0)
    E = -J * np.sum(s * right + s * down) - h * np.sum(s)
    return float(E)


def magnetization(spins: np.ndarray) -> float:
    """Total magnetization."""
    return float(np.sum(spins))


def metropolis_sweep(
    spins: np.ndarray,
    beta: float,
    *,
    J: float = 1.0,
    h: float = 0.0,
    rng: Optional[np.random.Generator] = None,
) -> None:
    """Perform one Metropolis sweep: L*L single-spin updates."""
    if beta < 0:
        raise ValueError("beta must be non-negative")
    rng = np.random.default_rng() if rng is None else rng
    L = spins.shape[0]
    n = L * L

    # Precompute exp(-beta * ΔE) for possible ΔE values in 2D Ising with z=4:
    # ΔE = 2*s*(J*sum_neighbors + h). sum_neighbors ∈ {-4,-2,0,2,4}
    # We'll compute on the fly for general h, but cache neighbor sums.
    for _ in range(n):
        i = rng.integers(0, L)
        j = rng.integers(0, L)
        s_ij = spins[i, j]

        # neighbor sum with periodic boundary
        nn = (
            spins[(i - 1) % L, j]
            + spins[(i + 1) % L, j]
            + spins[i, (j - 1) % L]
            + spins[i, (j + 1) % L]
        )

        dE = 2.0 * s_ij * (J * nn + h)

        if dE <= 0.0:
            spins[i, j] = -s_ij
        else:
            if rng.random() < np.exp(-beta * dE):
                spins[i, j] = -s_ij


def simulate_ising(
    L: int,
    beta: float,
    *,
    J: float = 1.0,
    h: float = 0.0,
    n_sweeps: int = 2000,
    burn_in: int = 500,
    thin: int = 1,
    seed: int = 0,
) -> IsingTrace:
    """
    Simulate 2D Ising using Metropolis sweeps.

    Returns per-spin energy and magnetization after burn-in (and thinning).
    """
    if n_sweeps <= 0:
        raise ValueError("n_sweeps must be positive")
    if burn_in < 0:
        raise ValueError("burn_in must be >= 0")
    if thin <= 0:
        raise ValueError("thin must be positive")
    if burn_in >= n_sweeps:
        raise ValueError("burn_in must be < n_sweeps")

    rng = np.random.default_rng(seed)
    spins = initialize_spins(L, rng=rng)

    energies = []
    mags = []

    for sweep in range(n_sweeps):
        metropolis_sweep(spins, beta, J=J, h=h, rng=rng)

        if sweep >= burn_in and ((sweep - burn_in) % thin == 0):
            E = energy(spins, J=J, h=h) / (L * L)
            M = magnetization(spins) / (L * L)
            energies.append(E)
            mags.append(M)

    return IsingTrace(
        energy=np.array(energies, dtype=float),
        magnetization=np.array(mags, dtype=float),
        spins=spins.copy(),
    )


def heat_capacity(beta: float, e_series: np.ndarray, *, kB: float = 1.0) -> float:
    """Cv per spin from energy per spin series."""
    e = np.asarray(e_series, dtype=float)
    return float((beta**2 / kB) * (e.var(ddof=1)))


def susceptibility(beta: float, m_series: np.ndarray, *, kB: float = 1.0) -> float:
    """Magnetic susceptibility per spin (using magnetization per spin series)."""
    m = np.asarray(m_series, dtype=float)
    return float((beta / kB) * (m.var(ddof=1)))


def binder_cumulant(m_series: np.ndarray) -> float:
    """Binder cumulant U = 1 - <m^4> / (3 <m^2>^2)."""
    m = np.asarray(m_series, dtype=float)
    m2 = np.mean(m**2)
    m4 = np.mean(m**4)
    if m2 == 0:
        return 0.0
    return float(1.0 - m4 / (3.0 * m2**2))
