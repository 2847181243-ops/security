# 实验报告：LAB-DET-002 Web XSS 检测规则

## 文档控制

| 项 | 值 |
|---|---|
| 编号 | LAB-DET-002 |
| 日期 | 2026-10-24 |
| 执行 | lead（AI） |
| 分类 | 防守 / 检测工程 |
| 风险级别 | 低 |
| 状态 | 完成（合成日志验证） |

## 1. 目标

为反射型 XSS 请求写检测规则，并在正常/恶意混合日志上验证。

## 2. 范围与环境

- Sigma 规则：docs/security/detections/xss-web.yml；
- 测试脚本：runtime/security/detect_web_xss.mjs；
- 样本：3 行重建日志（正常 name、脚本 payload、正常 javascript 搜索）。

## 3. 假设

H1：命中脚本 payload；H2：不命中正常参数和 javascript 关键词。

## 4. 步骤

1. 写规则，匹配 %3Cscript、<script、onerror 等；
2. 构造 3 行日志；
3. 跑等价正则匹配。

## 5. 结果

| 行 | 内容 | 结果 |
|---|---|---|
| 1 | name=world | ok |
| 2 | name=%3Cscript%3E... | ALERT |
| 3 | q=javascript+tutorial | ok |

命中 1/3。

## 6. 证据

- 规则、脚本、sample-xss.log；
- 输出 hits=1 total=3。

## 7. 分析

事实：规则能区分脚本 payload 与正常关键词。推断：编码变体（实体、大小写、其他标签）会漏，未逐项测。

## 8. 风险与影响

关键词规则误报低但漏报高；适合作为第一层告警。

## 9. 修复与后续

- 增加解码和 DOM sink 关联；
- 用真实 Apache 日志验证；
- 未解决：未接线上日志；Sigma 规则未由引擎执行，只跑了等价正则。

## 10. 结论

完成（合成日志验证）。
