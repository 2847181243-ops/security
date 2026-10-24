# 实验报告：LAB-DET-010 Sigma 转 Splunk SPL

## 文档控制

| 项 | 值 |
|---|---|
| 编号 | LAB-DET-010 |
| 日期 | 2026-10-24 |
| 执行 | lead（AI） |
| 分类 | 检测工程 / 规则编译 |
| 风险级别 | 低 |
| 状态 | 完成 |

## 1. 目标

用 pySigma 的 Splunk 后端把实验时的 10 条规则编译成 SPL，验证规则能被后端消费（现 13 条，SPL 未重跑）。

## 2. 范围与环境

- pySigma + pysigma-backend-splunk；
- 输入：docs/security/detections/*.yml；
- 输出：每条规则 1 条 SPL；不执行查询。

## 3. 假设

H1：10 条规则都能编译；H2：Web 规则字段名与常见日志不一致，需要映射。

## 4. 步骤

1. 安装 backend；
2. SigmaCollection.from_yaml 后调用 SplunkBackend.convert；
3. 输出每条 SPL 并统计。

## 5. 结果

| 检查项 | 预期 | 实际 | 结论 |
|---|---|---|---|
| 编译 | 实验时 10 条 | files=10 ok=10 bad=0（现 13 条未重编译） | 通过 |
| SPL 结构 | 每条 1 条 | queries=1 | 通过 |

示例：TargetImage 以 lsass.exe 结尾且 GrantedAccess 含 0x1010。

## 6. 证据

- 证据文件：data/security/experiments/LAB-DET-010/evidence.txt；
- 脚本：runtime/security/sigma_convert.py。

## 7. 分析

事实：实验时 10 条规则均编译成 SPL（后续新增规则未编译）。推断：Web 规则的 cs-uri-query 字段依赖代理/日志解析；Splunk 默认 Web 日志可能没有该字段，需要 CIM 映射，否则查询为空。

## 8. 风险与影响

编译通过不等于能查到；字段名/索引/时间范围不对会静默漏报。

## 9. 修复与后续

- 在 Splunk 里建字段别名并跑真实日志；
- 给 process_access 规则确认 Sysmon 事件源；
- 未解决：未执行 SPL。

## 10. 结论

通过：10 条规则可编译为 SPL；字段映射仍需实测。
