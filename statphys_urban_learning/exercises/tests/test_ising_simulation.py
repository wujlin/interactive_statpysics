import numpy as np

from exercises.src.ising import simulate_ising


def test_ising_ordered_vs_disordered_magnetization():
    L = 10
    n_sweeps = 1200
    burn_in = 400
    thin = 4

    # Low temperature (high beta): ordered phase
    trace_low = simulate_ising(L, beta=0.8, n_sweeps=n_sweeps, burn_in=burn_in, thin=thin, seed=123)
    m_low = float(np.mean(np.abs(trace_low.magnetization)))

    # High temperature (low beta): disordered phase
    trace_high = simulate_ising(L, beta=0.1, n_sweeps=n_sweeps, burn_in=burn_in, thin=thin, seed=123)
    m_high = float(np.mean(np.abs(trace_high.magnetization)))

    assert m_low > 0.5, f"expected ordered magnetization, got {m_low}"
    assert m_high < 0.3, f"expected disordered magnetization, got {m_high}"
