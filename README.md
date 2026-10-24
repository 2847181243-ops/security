# security

本地隔离靶场的安全实验记录：报告、检测规则、漏洞情报与脚本。

## 结构

| 目录 | 内容 | 许可 |
|---|---|---|
| docs/reports | 实验报告（模板 _模板.md，索引 索引.md） | CC BY 4.0 |
| docs/cards | 漏洞卡 | CC BY 4.0 |
| docs/intel | KEV/NVD/EPSS 情报简报 | CC BY 4.0 |
| docs/methodology | 靶场部署、隔离设计与应急方法 | CC BY 4.0 |
| rules/sigma | Sigma 检测规则 | CC BY 4.0 |
| rules/semgrep | 自写 Semgrep 规则 | CC BY 4.0 |
| scripts | 检测规则等价验证脚本 | MIT |

## 当前状态（2026-10-24）

- 报告 52 份，结构检查全 PASS；
- 高危 CVE：CVE-2021-41773、CVE-2022-22965、CVE-2023-46604、CVE-2016-3081、CVE-2017-12615 已复现；CVE-2021-44228 到 JNDI 回调；
- Sigma 规则 17 条，pySigma 解析 17/17；另有 Suricata 3 条；
- 检测脚本 18 个，CI 跑全部等价验证；
- 知识库 133 张，security 47 张；
- 质量门：accept_reports.mjs + 独立 subagent 复审。

## 范围

只记录授权范围内的本地实验：VirtualBox 隔离虚拟机、DVWA/Juice Shop、断网与快照回滚、针对本地靶场的渗透复现。

## 不包含

恶意样本、虚拟机磁盘、凭证、token、内网地址、对第三方系统的扫描记录。

## 脱敏

目标地址统一用 TEST-NET 192.0.2.0/24，口令用 <redacted>，路径用 <workspace>。

## 许可

- 代码与脚本：MIT，见根目录 LICENSE；
- 文档、报告、规则：CC BY 4.0，见 docs/LICENSE 与 rules/LICENSE。

仅用于授权的安全实验。未授权扫描或攻击他人系统违法。
