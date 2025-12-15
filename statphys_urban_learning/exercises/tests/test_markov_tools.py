import numpy as np

from exercises.src.markov import stationary_distribution, detailed_balance_violation, net_flux


def test_reversible_chain_has_zero_flux():
    rng = np.random.default_rng(0)
    n = 5
    A = rng.uniform(0.1, 1.0, size=(n, n))
    A = 0.5 * (A + A.T)  # symmetric positive matrix
    row_sums = A.sum(axis=1, keepdims=True)
    P = A / row_sums

    pi = stationary_distribution(P)

    # stationarity check
    assert np.allclose(pi @ P, pi, atol=1e-8)

    viol = detailed_balance_violation(P, pi=pi)
    assert viol < 1e-8

    J = net_flux(P, pi=pi)
    assert np.max(np.abs(J)) < 1e-8


def test_cycle_chain_violates_detailed_balance():
    # 3-cycle: deterministic rotation
    P = np.array([[0.0, 1.0, 0.0],
                  [0.0, 0.0, 1.0],
                  [1.0, 0.0, 0.0]])

    pi = stationary_distribution(P)
    assert np.allclose(pi, np.ones(3) / 3, atol=1e-8)

    viol = detailed_balance_violation(P, pi=pi)
    assert viol > 1e-3
