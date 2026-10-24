# 实验报告：LAB-FUZZ-003 Jazzer 覆盖率引导 fuzz 基线

## 文档控制

| 项 | 值 |
|---|---|
| 编号 | LAB-FUZZ-003 |
| 日期 | 2026-10-25 |
| 执行 | lead（AI） |
| 分类 | 模糊测试 / 工具链 |
| 风险级别 | 低 |
| 状态 | 完成（基线） |

## 1. 目标

把覆盖率引导 fuzzer 跑起来，建立可重复的 harness 基线。

## 2. 范围与环境

- Windows，Node 24，@jazzer.js/core（npm 安装）；
- 目标：urltarget.cjs，对 new URL(s,"http://x") 做 3 万次变异；
- 只打本机，无网络。

## 3. 假设

H1：Jazzer 能在 Windows 跑；H2：URL 解析本身不应崩溃。

## 4. 步骤

1. npm install @jazzer.js/core；
2. 写 exports.fuzz(data) harness；
3. npx jazzer urltarget.cjs corpus -- -runs=30000；
4. 记录覆盖与崩溃。

## 5. 结果

| 指标 | 实际 |
|---|---|
| 运行次数 | 30,000 |
| 覆盖边 | 7 |
| 语料 | 2 条 / 3 字节 |
| 崩溃 | 0 |

## 6. 证据

- 证据文件：data/security/experiments/LAB-FUZZ-003/evidence.txt；
- harness：lab/fuzz/urltarget.cjs；
- 语料目录：lab/fuzz/corpus。

## 7. 分析

事实：Jazzer 实际执行了覆盖率引导变异，30k 次无崩溃。推断：URL 解析本身很稳；真正的价值在于把 harness 指向有状态/解析复杂的目标，而不是这个包一层 URL 的玩具。

## 8. 风险与影响

0 崩溃不代表目标安全；覆盖只有 7 条边，说明目标太小。

## 9. 修复与后续

- 把 harness 指向 /fetch、日志解析或 DSH 包的实际函数；
- 加 sanitizer/断言（越权、路径逃逸）；
- 未解决：未对真实组件做覆盖率 fuzz。

## 10. 结论

完成基线：Jazzer 可用，30k 次 URL 变异无崩溃；下一步换真实目标。
