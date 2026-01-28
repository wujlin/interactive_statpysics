import numpy as np

from projects.p04_diffusion_network.src.diffusion import build_grid_transition, evolve, total_variation, uniform


def test_grid_transition_is_row_stochastic_and_nonnegative():
    P = build_grid_transition(grid=7, stay=0.5, periodic=True)
    assert P.shape == (49, 49)
    assert np.allclose(P.sum(axis=1), 1.0, atol=1e-12)
    assert np.min(P) >= -1e-15


def test_uniform_is_stationary_on_periodic_grid():
    P = build_grid_transition(grid=6, stay=0.4, periodic=True)
    u = uniform(P.shape[0])
    assert np.allclose(u @ P, u, atol=1e-12)


def test_diffusion_smooths_a_pulse_toward_uniform():
    grid = 5
    P = build_grid_transition(grid=grid, stay=0.5, periodic=True)
    n = P.shape[0]
    p0 = np.zeros(n)
    p0[(grid // 2) * grid + (grid // 2)] = 1.0

    p1 = evolve(p0, P, steps=1)
    assert np.isclose(p1.sum(), 1.0, atol=1e-12)
    assert np.min(p1) >= -1e-15

    u = uniform(n)
    tv0 = total_variation(p0, u)
    pT = evolve(p0, P, steps=160)
    tvT = total_variation(pT, u)

    assert tvT < tv0
    assert tvT < 0.25
    assert float(np.max(pT) - np.min(pT)) < 0.08

