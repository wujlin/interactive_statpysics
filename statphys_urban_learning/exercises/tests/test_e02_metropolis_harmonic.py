import numpy as np

from exercises.src.e02_metropolis_harmonic import MetropolisConfig, metropolis_harmonic, analytic_mean_var


def test_metropolis_harmonic_mean_var():
    cfg = MetropolisConfig(
        n_steps=80_000,
        beta=2.0,
        step_size=1.2,
        x0=5.0,
        burn_in=10_000,
        thin=20,
        seed=42,
    )
    samples = metropolis_harmonic(cfg)
    assert samples.ndim == 1
    assert len(samples) > 500

    m_hat = float(np.mean(samples))
    v_hat = float(np.var(samples, ddof=0))

    m_true, v_true = analytic_mean_var(cfg.beta)

    # 由于是随机采样，阈值不要设太死
    assert abs(m_hat - m_true) < 0.08
    assert abs(v_hat - v_true) / v_true < 0.12
