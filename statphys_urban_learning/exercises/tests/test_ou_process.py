import numpy as np

from exercises.src.ou import simulate_ou, stationary_variance


def test_ou_stationary_mean_and_variance():
    theta = 2.0
    mu = 1.0
    sigma = 0.5
    dt = 1e-3
    n_steps = 60000

    tr = simulate_ou(theta=theta, mu=mu, sigma=sigma, x0=-2.0, dt=dt, n_steps=n_steps, seed=0)

    burn = 10000
    x = tr.x[burn:]

    mean = float(np.mean(x))
    var = float(np.var(x, ddof=1))

    var_theory = stationary_variance(theta, sigma)

    assert abs(mean - mu) < 0.05
    assert abs(var - var_theory) < 0.02
