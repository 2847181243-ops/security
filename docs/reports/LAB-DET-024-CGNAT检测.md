# 实验报告：LAB-DET-024 SSRF 指向 CGNAT 检测

## 文档控制

| 项 | 值 |
|---|---|
| 编号 | LAB-DET-024 |
| 日期 | 2026-10-25 |
| 执行 | lead（AI） |
| 分类 | 防守 / 检测工程 |
| 风险级别 | 低 |
| 状态 | 完成（合成日志） |

## 1. 目标

为 SSRF 指向 100.64.0.0/10（CGNAT）写检测规则；该段在部分网络可到内部服务。

## 2. 范围与环境

- 规则：docs/security/detections/ssrf-cgnat.yml；
- 脚本：runtime/security/detect_cgnat.mjs；
- 样本：2 行日志（example.com、100.64.1.2）；
- 未接真实日志。

## 3. 假设

H1：CGNAT 地址命中；H2：普通域名不命中。

## 4. 步骤

1. 规则用正则匹配 100.64-127 的第二段；
2. 构造 2 行日志；
3. 等价匹配。

## 5. 结果

| 行 | 结果 |
|---|---|
| example.com | ok |
| 100.64.1.2 | ALERT |

hits=1 total=2；Sigma 解析 18/18。

## 6. 证据

- 证据文件：data/security/experiments/LAB-DET-024/evidence.txt；
- 规则：docs/security/detections/ssrf-cgnat.yml；
- 脚本：runtime/security/detect_cgnat.mjs。

## 7. 分析

事实：CGNAT 地址命中，普通域名不命中。推断：100.64/10 是否算内网取决于部署；规则应作为线索，不单独定性。

## 8. 风险与影响

只覆盖 query；编码变体/重定向会漏。

## 9. 修复与后续

- 结合资产清单判断 CGNAT 用途；
- 在采集侧归一化；
- 未解决：未在真实日志验证。

## 10. 结论

通过：CGNAT SSRF 规则在合成日志上命中。
