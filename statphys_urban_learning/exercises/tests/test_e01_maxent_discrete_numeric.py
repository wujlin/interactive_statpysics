import numpy as np

from exercises.src.e01_maxent_discrete import maxent_from_moments


def test_maxent_discrete_recovers_moments():
    # Discrete states
    x = np.arange(0, 6, dtype=float)  # 0..5
    F = np.stack([x, x**2], axis=1)   # (n, K)

    # Ground-truth lambdas (generate feasible targets)
    lam_true = np.array([0.7, -0.12], dtype=float)
    logw = -(F @ lam_true)
    logw -= logw.max()
    p_true = np.exp(logw)
    p_true /= p_true.sum()

    targets = p_true @ F  # exact moments under p_true

    res = maxent_from_moments(F, targets, max_iter=200, tol=1e-12)

    assert res.converged, f"did not converge; err={res.max_abs_constraint_error}"
    assert np.isclose(res.p.sum(), 1.0, atol=1e-12)
    assert np.all(res.p > 0.0)

    # Moments should match targets closely
    assert np.max(np.abs(res.moments - targets)) < 1e-9

    # Distribution should match closely (lambdas might not be exact due to ridge/damping)
    assert np.max(np.abs(res.p - p_true)) < 1e-6
