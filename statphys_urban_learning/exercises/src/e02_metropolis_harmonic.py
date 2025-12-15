"""
E02: Metropolis 采样一维谐振子（目标分布为高斯）

目标分布：
    π(x) ∝ exp(-β * x^2 / 2)

解析结果：
    E[x] = 0
    Var[x] = 1/β
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Optional, Tuple

import numpy as np


@dataclass
class MetropolisConfig:
    n_steps: int = 50_000
    beta: float = 1.0
    step_size: float = 1.0
    x0: float = 0.0
    burn_in: int = 5_000
    thin: int = 10
    seed: int = 0


def energy_harmonic(x: float) -> float:
    """E(x)=x^2/2"""
    return 0.5 * x * x


def metropolis_harmonic(cfg: MetropolisConfig) -> np.ndarray:
    """
    用对称随机游走提议 x' = x + U[-step_size, step_size] 做 Metropolis 采样。

    返回：burn-in 后并做 thin 的样本数组。
    """
    if cfg.n_steps <= 0:
        raise ValueError("n_steps must be positive")
    if cfg.beta <= 0:
        raise ValueError("beta must be positive")
    if cfg.step_size <= 0:
        raise ValueError("step_size must be positive")
    if cfg.burn_in < 0:
        raise ValueError("burn_in must be non-negative")
    if cfg.thin <= 0:
        raise ValueError("thin must be positive")

    rng = np.random.default_rng(cfg.seed)

    x = float(cfg.x0)
    e = energy_harmonic(x)
    beta = float(cfg.beta)

    samples = []
    accepted = 0

    for t in range(cfg.n_steps):
        proposal = x + rng.uniform(-cfg.step_size, cfg.step_size)
        e_prop = energy_harmonic(proposal)

        # 对称提议 => 接受率 a = min(1, exp(-β (E'-E)))
        log_alpha = -beta * (e_prop - e)
        if log_alpha >= 0 or np.log(rng.random()) < log_alpha:
            x = proposal
            e = e_prop
            accepted += 1

        # 记录样本（burn-in 后）
        if t >= cfg.burn_in and ((t - cfg.burn_in) % cfg.thin == 0):
            samples.append(x)

    return np.asarray(samples, dtype=float)


def analytic_mean_var(beta: float) -> Tuple[float, float]:
    """返回目标分布的解析均值与方差"""
    if beta <= 0:
        raise ValueError("beta must be positive")
    return 0.0, 1.0 / beta
