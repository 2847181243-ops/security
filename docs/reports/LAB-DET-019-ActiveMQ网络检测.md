# 实验报告：LAB-DET-019 ActiveMQ OpenWire 网络检测

## 文档控制

| 项 | 值 |
|---|---|
| 编号 | LAB-DET-019 |
| 日期 | 2026-10-24 |
| 执行 | lead（AI） |
| 分类 | 防守 / 网络检测 |
| 风险级别 | 低 |
| 状态 | 完成（合成载荷） |

## 1. 目标

为 CVE-2023-46604 写一条 Suricata 规则，匹配 OpenWire 流里的 ClassPathXmlApplicationContext。

## 2. 范围与环境

- 规则：rules/suricata/activemq-cve-2023-46604.rules；
- 脚本：runtime/security/test_suricata.mjs（等价内容匹配）；
- 样本：普通 HTTP 字节、含类名的 OpenWire 字节；
- 未运行 Suricata 引擎。

## 3. 假设

H1：含类名的载荷命中；H2：普通 HTTP 不命中。

## 4. 步骤

1. 写规则，目标端口 61616，content 为类名；
2. 构造两份字节样本；
3. 用等价匹配统计。

## 5. 结果

| 样本 | 结果 |
|---|---|
| 普通 HTTP | ok |
| OpenWire + ClassPathXmlApplicationContext | ALERT |

hits=1 total=2。

## 6. 证据

- 证据文件：data/security/experiments/LAB-DET-019/evidence.txt；
- 规则：rules/suricata/activemq-cve-2023-46604.rules；
- 脚本：runtime/security/test_suricata.mjs。

## 7. 分析

事实：类名匹配可区分两份样本。推断：TLS/分片/压缩会绕过；需要流量还原和端口/协议白名单。

## 8. 风险与影响

只匹配类名，误报取决于正常应用是否加载该类。

## 9. 修复与后续

- 在 Suricata 里加载规则跑真实流量；
- 加 flowbits 与端口约束；
- 未解决：未执行引擎。

## 10. 结论

通过：ActiveMQ 网络规则在合成载荷上命中。
