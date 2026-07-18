import numpy as np

from exercises.src.active_fdt import (
    active_force_spectrum,
    analytic_probe_dissipation,
    equilibrium_fdt_position_spectrum,
    fdt_violation_position,
    integrate_even_spectrum,
    position_spectrum,
    probe_dissipation_density,
    simulate_active_ou_probe,
)


def test_thermal_model_satisfies_fdt_at_every_frequency():
    omega = np.logspace(-3, 3, 300)
    measured = position_spectrum(
        omega,
        k=1.7,
        gamma=0.8,
        kbt=2.1,
        active_strength=0.0,
        active_tau=0.4,
    )
    predicted = equilibrium_fdt_position_spectrum(omega, k=1.7, gamma=0.8, kbt=2.1)
    np.testing.assert_allclose(measured, predicted, rtol=1e-13, atol=1e-13)


def test_active_excess_is_exactly_the_filtered_active_force():
    omega = np.logspace(-2, 2, 200)
    k = 1.3
    gamma = 0.7
    active_strength = 2.4
    active_tau = 0.6

    excess = fdt_violation_position(
        omega,
        k=k,
        gamma=gamma,
        active_strength=active_strength,
        active_tau=active_tau,
    )
    expected = active_force_spectrum(
        omega, active_strength=active_strength, active_tau=active_tau
    ) / (k**2 + (gamma * omega) ** 2)

    np.testing.assert_allclose(excess, expected, rtol=1e-13, atol=1e-13)
    assert np.all(excess >= 0)


def test_harada_sasa_integral_matches_closed_form():
    params = dict(k=1.4, gamma=0.9, active_strength=2.2, active_tau=0.7)
    omega = np.concatenate(([0.0], np.logspace(-5, 5, 200_000)))
    density = probe_dissipation_density(omega, **params)
    numerical = integrate_even_spectrum(omega, density)
    analytic = analytic_probe_dissipation(**params)
    assert np.isclose(numerical, analytic, rtol=2e-5)


def test_active_force_simulation_has_the_prescribed_stationary_variance():
    active_strength = 1.6
    active_tau = 0.4
    trace = simulate_active_ou_probe(
        active_strength=active_strength,
        active_tau=active_tau,
        dt=5e-4,
        n_steps=120_000,
        seed=4,
    )
    measured = np.var(trace.active_force[20_000:])
    expected = active_strength / (2.0 * active_tau)
    assert np.isclose(measured, expected, rtol=0.12)
