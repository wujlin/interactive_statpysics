"""Active Ornstein--Uhlenbeck forcing and Harada--Sasa spectra for M11.

The overdamped probe obeys

    gamma * dx/dt = -k*x + xi_T + xi_A + h,

with thermal noise ``<xi_T(t) xi_T(t')> = 2 gamma kBT delta(t-t')``
and active-force correlation

    <xi_A(t) xi_A(t')> = A/(2 tau) exp(-|t-t'|/tau).

Fourier convention: f_tilde(omega) = integral dt exp(i omega t) f(t).
"""

from __future__ import annotations

from dataclasses import dataclass

import numpy as np


@dataclass
class ActiveOUTrace:
    t: np.ndarray
    x: np.ndarray
    active_force: np.ndarray


def position_response(omega: np.ndarray | float, *, k: float, gamma: float) -> np.ndarray:
    """Complex position response chi_x(omega) = 1 / (k - i gamma omega)."""
    w = np.asarray(omega, dtype=float)
    return 1.0 / (k - 1j * gamma * w)


def active_force_spectrum(
    omega: np.ndarray | float, *, active_strength: float, active_tau: float
) -> np.ndarray:
    """Two-sided power spectrum of the exponentially correlated active force."""
    w = np.asarray(omega, dtype=float)
    return active_strength / (1.0 + (w * active_tau) ** 2)


def position_spectrum(
    omega: np.ndarray | float,
    *,
    k: float,
    gamma: float,
    kbt: float,
    active_strength: float = 0.0,
    active_tau: float = 1.0,
) -> np.ndarray:
    """Steady position spectrum including thermal and active forcing."""
    chi = position_response(omega, k=k, gamma=gamma)
    forcing = 2.0 * gamma * kbt + active_force_spectrum(
        omega, active_strength=active_strength, active_tau=active_tau
    )
    return np.abs(chi) ** 2 * forcing


def equilibrium_fdt_position_spectrum(
    omega: np.ndarray | float, *, k: float, gamma: float, kbt: float
) -> np.ndarray:
    """Equilibrium FDT prediction 2 kBT Im[chi_x]/omega, including omega=0."""
    w = np.asarray(omega, dtype=float)
    return 2.0 * gamma * kbt / (k**2 + (gamma * w) ** 2)


def fdt_violation_position(
    omega: np.ndarray | float,
    *,
    k: float,
    gamma: float,
    active_strength: float,
    active_tau: float,
) -> np.ndarray:
    """C_xx - 2 kBT Im[chi_x]/omega for the additive active-force model.

    The thermal contribution cancels exactly, so this expression is independent
    of ``kBT``. Pointwise non-negativity is a property of this simple model, not
    a general theorem for frequency-resolved nonequilibrium systems.
    """
    w = np.asarray(omega, dtype=float)
    denominator = (k**2 + (gamma * w) ** 2) * (1.0 + (active_tau * w) ** 2)
    return active_strength / denominator


def probe_dissipation_density(
    omega: np.ndarray | float,
    *,
    k: float,
    gamma: float,
    active_strength: float,
    active_tau: float,
) -> np.ndarray:
    """Even Harada--Sasa integrand gamma*omega^2*Delta C_xx.

    Integrating this two-sided density with ``d omega / (2 pi)`` gives the
    steady heat current from the observed probe into the equilibrium bath.
    """
    w = np.asarray(omega, dtype=float)
    return gamma * w**2 * fdt_violation_position(
        w,
        k=k,
        gamma=gamma,
        active_strength=active_strength,
        active_tau=active_tau,
    )


def analytic_probe_dissipation(
    *, k: float, gamma: float, active_strength: float, active_tau: float
) -> float:
    """Closed-form probe heat current A / [2 tau (gamma + k tau)]."""
    if k <= 0 or gamma <= 0 or active_tau <= 0:
        raise ValueError("k, gamma, and active_tau must be positive")
    if active_strength < 0:
        raise ValueError("active_strength must be non-negative")
    return float(active_strength / (2.0 * active_tau * (gamma + k * active_tau)))


def integrate_even_spectrum(omega: np.ndarray, density: np.ndarray) -> float:
    """Numerically integrate an even spectrum supplied on omega >= 0."""
    w = np.asarray(omega, dtype=float)
    q = np.asarray(density, dtype=float)
    if w.ndim != 1 or q.shape != w.shape or w.size < 2:
        raise ValueError("omega and density must be one-dimensional arrays of equal length")
    if w[0] < 0 or np.any(np.diff(w) <= 0):
        raise ValueError("omega must be strictly increasing and non-negative")
    integral = 0.5 * np.sum((q[:-1] + q[1:]) * np.diff(w))
    return float(integral / np.pi)


def simulate_active_ou_probe(
    *,
    k: float = 1.0,
    gamma: float = 1.0,
    kbt: float = 1.0,
    active_strength: float = 1.0,
    active_tau: float = 1.0,
    x0: float = 0.0,
    active0: float = 0.0,
    dt: float = 1e-3,
    n_steps: int = 20_000,
    seed: int = 0,
) -> ActiveOUTrace:
    """Euler--Maruyama simulation of the trapped probe and its OU active force."""
    if k <= 0 or gamma <= 0 or active_tau <= 0 or dt <= 0:
        raise ValueError("k, gamma, active_tau, and dt must be positive")
    if kbt < 0 or active_strength < 0:
        raise ValueError("kbt and active_strength must be non-negative")
    if n_steps <= 1:
        raise ValueError("n_steps must be greater than one")

    rng = np.random.default_rng(seed)
    t = np.arange(n_steps, dtype=float) * dt
    x = np.empty(n_steps, dtype=float)
    active = np.empty(n_steps, dtype=float)
    x[0] = x0
    active[0] = active0

    sqrt_dt = np.sqrt(dt)
    thermal_scale = np.sqrt(2.0 * kbt / gamma)
    active_scale = np.sqrt(active_strength) / active_tau

    for i in range(1, n_steps):
        previous_active = active[i - 1]
        active[i] = (
            previous_active
            - previous_active * dt / active_tau
            + active_scale * sqrt_dt * rng.normal()
        )
        x[i] = (
            x[i - 1]
            + (-k * x[i - 1] + previous_active) * dt / gamma
            + thermal_scale * sqrt_dt * rng.normal()
        )

    return ActiveOUTrace(t=t, x=x, active_force=active)
