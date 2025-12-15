---
type: derivation
title: 有限尺寸效应 Finite-size effects
tags: ['phase-transition', 'M7']
prereq: ['相变 Phase transition', '相关长度 Correlation length']
source: ['finite-size scaling basics']
status: ready
---

## 目标
- 解释：为什么理论上“发散/非解析”的临界现象，在有限系统的数值模拟里表现为“峰值/平滑过渡”。

## 核心原因
- 临界点附近相关长度 \(\xi\) 变大；
- 有限系统只有有限大小 \(L\)：
  - 当 \(\xi \ll L\)：系统近似“无限大”，临界特征清晰
  - 当 \(\xi \gtrsim L\)：相关长度被系统尺寸截断，发散被“截断成峰值”

## 典型表现
- 热容/易感性不发散，而出现随 L 增大越来越尖的峰
- 峰值位置随 L 发生漂移（finite-size shift）

## 最小可用结论（做项目够用）
- 用不同尺寸 \(L\) 的曲线比较：
  - 若峰值随 L 增大更尖、更高 ⇒ 临界附近
  - Binder cumulant 常用于更稳健地定位临界点

## 城市连接（最小）
- 城市系统的“有限规模”对应有限尺寸；很多所谓“突变”在有限样本下只表现为尖峰/快速过渡，要用尺度语言解释和外推。
