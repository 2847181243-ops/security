# 实验报告：LAB-DET-021 Log4Shell 网络层检测

## 文档控制

| 项 | 值 |
|---|---|
| 编号 | LAB-DET-021 |
| 日期 | 2026-10-24 |
| 执行 | lead（AI） |
| 分类 | 防守 / 网络检测 |
| 风险级别 | 低 |
| 状态 | 完成（合成载荷） |

## 1. 目标

为 CVE-2021-44228 写一条 Suricata 规则，匹配 jndi:ldap:// 形式。

## 2. 范围与环境

- 规则：rules/suricata/log4shell-jndi.rules；
- 脚本：runtime/security/test_log4shell_net.mjs（等价内容匹配）；
- 样本：普通 HTTP 行、含 jndi:ldap 的行；
- 未运行 Suricata 引擎。

## 3. 假设

H1：含 jndi:ldap 的载荷命中；H2：普通 HTTP 不命中。

## 4. 步骤

1. 写规则，flow to_server，content 为 jndi:ldap://；
2. 构造 2 行样本；
3. 用等价匹配统计。

## 5. 结果

| 行 | 结果 |
|---|---|
| 普通 HTTP | ok |
| jndi:ldap://127.0.0.1:1389/a | ALERT |

hits=1 total=2。

## 6. 证据

- 证据文件：data/security/experiments/LAB-DET-021/evidence.txt；
- 规则：rules/suricata/log4shell-jndi.rules；
- 脚本：runtime/security/test_log4shell_net.mjs。

## 7. 分析

事实：jndi:ldap 字面量可区分两份样本。推断：编码/分片/TLS 会绕过；需要流量还原。

## 8. 风险与影响

规则带 nocase，大小写已覆盖；编码/分片/TLS 仍可能漏。

## 9. 修复与后续

- 在 Suricata 加载跑真实流量；
- 加 dns/rmi 变体；
- 未解决：未执行引擎。

## 10. 结论

通过：等价匹配在合成载荷上命中；Suricata 规则未加载，仅做内容匹配。
