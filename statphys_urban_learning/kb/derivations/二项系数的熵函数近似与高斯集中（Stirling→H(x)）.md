---
type: derivation
title: 二项系数的熵函数近似与高斯集中（Stirling→H(x)）
tags: ['microcanonical', 'typicality', 'gaussian', 'thermodynamic-limit', 'stirling', 'M2']
prereq: ['Stirling 近似 Stirling approximation', '多重度 multiplicity Ω', '熵 Entropy', '热力学极限 Thermodynamic limit']
source: ['standard combinatorics', 'Khinchin 1949 (typicality)']
status: ready
---

## 目标
- 把“典型性/测度集中”落到一个最小可算例子：\(\Omega(n)=\binom{N}{n}\) 在 \(n=N/2\) 附近为何近似高斯，从而给出 \(\sigma\sim \sqrt{N}\)、相对涨落 \(\sim 1/\sqrt{N}\)。
- 解决常见卡点：为什么会出现二元熵函数 \(H(x)\)，以及为什么 \(\ln\binom{N}{n}\approx N H(x)\)。

---

## 设定：两盒分球/硬币模型
有 \(N\) 个可区分球独立进入左/右盒。宏观态用左盒球数 \(n\) 表示，则多重度
\[
\Omega(n)=\binom{N}{n}.
\]
如果每个球进入左盒概率为 \(1/2\)，则
\[
P(n)=2^{-N}\binom{N}{n}.
\]

我们关心两件事：
1) \(\binom{N}{n}\) 的峰在何处？（最概然宏观态）  
2) 峰有多窄？（涨落尺度、相对涨落）

---

## 1) 从 \(\ln\binom{N}{n}\) 到 \(N H(x)\)：Stirling 近似
从定义出发：
\[
\binom{N}{n}=\frac{N!}{n!(N-n)!}
\quad\Rightarrow\quad
\ln\binom{N}{n}=\ln N!-\ln n!-\ln (N-n)!.
\]

对大数用 Stirling 展开（主导项足够用于刻画峰形；更高阶项只影响前因子）：
\[
\ln m! = m\ln m - m + \frac12\ln(2\pi m)+O\!\left(\frac{1}{m}\right).
\]
先保留 \(m\ln m-m\) 这些 \(O(N)\) 的主导项：
\[
\ln\binom{N}{n}\approx (N\ln N-N)-(n\ln n-n)-((N-n)\ln(N-n)-(N-n))
=N\ln N-n\ln n-(N-n)\ln(N-n).
\]

引入比例变量
\[
x\equiv \frac{n}{N},\qquad n=xN,\qquad N-n=(1-x)N,
\]
代入并整理：
\[
\begin{aligned}
\ln\binom{N}{n}
&\approx N\ln N-xN\ln(xN)-(1-x)N\ln((1-x)N) \\
&= N\ln N-xN(\ln x+\ln N)-(1-x)N(\ln(1-x)+\ln N)\\
&= -N\bigl[x\ln x+(1-x)\ln(1-x)\bigr].
\end{aligned}
\]

于是自然出现二元熵函数（binary entropy）
\[
H(x)\equiv -x\ln x-(1-x)\ln(1-x),
\]
得到关键关系：
\[
\boxed{\ \ln\binom{N}{n}\approx N\,H(x)\ }\qquad (N\ \text{大且}\ x\ \text{不贴边}).
\]

> 更精确的近似会多一个 \(O(\ln N)\) 的校正：
> \[
> \ln\binom{N}{n} \approx N H(x) - \frac12\ln\!\bigl(2\pi N x(1-x)\bigr),
> \]
> 但这不改变“指数里那坨 \(N\)”主导的高斯集中结论。

---

## 2) 在 \(x^\*=1/2\) 附近二阶展开 \(H(x)\)
先求导：
\[
H(x)= -x\ln x -(1-x)\ln(1-x),
\]
\[
H'(x)=\ln\frac{1-x}{x},\qquad
H''(x)=-\frac{1}{1-x}-\frac{1}{x}.
\]
因此
\[
H\!\left(\frac12\right)=\ln 2,\qquad H'\!\left(\frac12\right)=0,\qquad H''\!\left(\frac12\right)=-4.
\]

在 \(x=1/2\) 附近做二阶 Taylor（因为一阶项为 0）：
\[
\boxed{
H(x)\approx \ln2-2\left(x-\frac12\right)^2
}.
\]

---

## 3) 拼起来：\(\ln\binom{N}{n}\) 的二次近似
把 \(\ln\binom{N}{n}\approx N H(x)\) 与上式合并：
\[
\ln\binom{N}{n}\approx N\ln2-2N\left(x-\frac12\right)^2.
\]
写回 \(n\)（用 \(x-\tfrac12=(n-N/2)/N\)）：
\[
\boxed{
\ln\binom{N}{n}\approx N\ln2-\frac{2}{N}\left(n-\frac{N}{2}\right)^2
}.
\]

---

## 4) 高斯近似与方差：\(\mathrm{Var}(n)=N/4\)
由
\[
P(n)=2^{-N}\binom{N}{n},
\]
可得在峰附近
\[
P(n)\propto \exp\!\left[-\frac{2}{N}\left(n-\frac{N}{2}\right)^2\right].
\]
与标准高斯 \(\exp(-(n-\mu)^2/(2\sigma^2))\) 对比：
\[
\mu=\frac{N}{2},\qquad \sigma^2=\frac{N}{4}.
\]
这与二项分布 \(\mathrm{Binomial}(N,1/2)\) 的精确结果一致。

---

## 5) 这张卡想让你记住的一句话
当 \(\ln\Omega\) 里出现一个“\(N\times\)（某个光滑函数）”，那么在极大点附近二阶展开就会得到高斯；而只要均值 \(\propto N\)、方差 \(\propto N\)，相对涨落就会 \(\sim 1/\sqrt{N}\)。
