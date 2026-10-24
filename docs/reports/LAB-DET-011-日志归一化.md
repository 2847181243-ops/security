# 实验报告：LAB-DET-011 Apache 日志归一化

## 文档控制

| 项 | 值 |
|---|---|
| 编号 | LAB-DET-011 |
| 日期 | 2026-10-24 |
| 执行 | lead（AI） |
| 分类 | 检测工程 / 日志解析 |
| 风险级别 | 低 |
| 状态 | 完成 |

## 1. 目标

把 Apache combined 日志解析成 CIM 风格 JSONL，解决 Sigma 规则 cs-uri-query 字段缺失的问题。

## 2. 范围与环境

- 输入：data/security/detections/live-dvwa.log（30 行，含 PHP notice）；
- 脚本：runtime/security/normalize_web_log.mjs；
- 输出：live-dvwa.jsonl，字段 c_ip、time、method、uri、cs_uri_stem、cs_uri_query、sc_status、bytes。

## 3. 假设

H1：访问日志可解析；H2：归一化后规则能按字段命中。

## 4. 步骤

1. 用正则解析 combined 格式；
2. 拆 uri 为 stem 和 query；
3. 用字段跑 SQLi/XSS 匹配。

## 5. 结果

| 检查项 | 预期 | 实际 | 结论 |
|---|---|---|---|
| 解析 | 多数行 | parsed=15 bad=15（bad 为 PHP notice） | 通过 |
| SQLi | 命中 | 4 行 | 通过 |
| XSS | 命中 | 1 行 | 通过 |

## 6. 证据

- 证据文件：data/security/experiments/LAB-DET-011/evidence.txt；
- JSONL：data/security/detections/live-dvwa.jsonl；
- 脚本：normalize_web_log.mjs、detect_jsonl.mjs。

## 7. 分析

事实：15 条访问日志全部解析，PHP notice 被跳过；归一化后命中 4 条 SQLi、1 条 XSS。推断：把 field 映射做在采集侧，Sigma 的 cs-uri-query 才能落地。

## 8. 风险与影响

正则只覆盖 combined 格式；改日志格式会全丢。

## 9. 修复与后续

- 支持 JSON/ECS 日志；
- 给解析失败计数告警；
- 未解决：未接 Splunk/Elastic。

## 10. 结论

通过：日志归一化可用，字段级检测命中。
