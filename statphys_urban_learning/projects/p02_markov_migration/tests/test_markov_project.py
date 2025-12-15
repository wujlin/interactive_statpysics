import numpy as np

from projects.p02_markov_migration.src.markov import (
    stationary_distribution,
    net_flux,
    detailed_balance_violation,
)


def test_stationarity_and_detailed_balance_for_symmetric_construction():
    rng = np.random.default_rng(0)
    n = 6
    A = rng.uniform(0.1, 1.0, size=(n, n))
    A = 0.5 * (A + A.T)

    P = A / A.sum(axis=1, keepdims=True)
    pi = stationary_distribution(P)

    assert np.allclose(pi @ P, pi, atol=1e-8)

    viol = detailed_balance_violation(P, pi=pi)
    assert viol < 1e-8

    J = net_flux(P, pi=pi)
    assert np.max(np.abs(J)) < 1e-8


def test_cycle_has_nonzero_flux():
    P = np.array([[0.0, 1.0, 0.0],
                  [0.0, 0.0, 1.0],
                  [1.0, 0.0, 0.0]])

    pi = stationary_distribution(P)
    viol = detailed_balance_violation(P, pi=pi)
    assert viol > 1e-3
