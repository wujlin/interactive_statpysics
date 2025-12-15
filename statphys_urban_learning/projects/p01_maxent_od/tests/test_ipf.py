import numpy as np

from projects.p01_maxent_od.src.ipf import maxent_od


def test_maxent_od_matches_marginals():
    rng = np.random.default_rng(0)
    m, n = 5, 7
    # Create positive marginals with equal totals
    row = rng.uniform(10, 50, size=m)
    col = rng.uniform(5, 30, size=n)
    col = col * (row.sum() / col.sum())

    res = maxent_od(row, col, tol=1e-9, max_iter=5000)
    T = res.T

    assert np.all(T >= 0)
    assert np.max(np.abs(T.sum(axis=1) - row) / (row + 1e-12)) < 1e-7
    assert np.max(np.abs(T.sum(axis=0) - col) / (col + 1e-12)) < 1e-7
