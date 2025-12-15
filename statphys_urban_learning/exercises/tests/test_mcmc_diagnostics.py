import numpy as np

from exercises.src.mcmc_diagnostics import integrated_autocorr_time, effective_sample_size


def _ar1(phi: float, n: int, seed: int = 0) -> np.ndarray:
    rng = np.random.default_rng(seed)
    x = np.zeros(n, dtype=float)
    eps = rng.normal(size=n)
    for t in range(1, n):
        x[t] = phi * x[t - 1] + eps[t]
    return x


def test_ar1_tau_int_reasonable():
    phi = 0.8
    n = 20000
    x = _ar1(phi, n, seed=123)

    diag = integrated_autocorr_time(x, max_lag=2000)

    # Theoretical tau_int for AR(1) is (1+phi)/(1-phi) = 9
    # Estimator is approximate; accept a reasonable band.
    assert 5.0 < diag.tau_int < 15.0
    assert 0 < diag.ess < n


def test_constant_chain():
    x = np.ones(1000)
    diag = integrated_autocorr_time(x, max_lag=100)
    assert diag.tau_int == 1.0
    assert diag.ess == 1000.0
    assert effective_sample_size(x, max_lag=100) == 1000.0
