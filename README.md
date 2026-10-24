# security

本地隔离靶场的安全实验记录：报告、检测规则、漏洞情报与脚本。

## 结构

| 目录 | 内容 |
|---|---|
| docs/reports | 实验报告（模板 _模板.md，索引 索引.md） |
| docs/intel | KEV/NVD/EPSS 情报简报 |
| docs/methodology | 靶场部署、隔离设计与应急方法 |
| rules/sigma | Sigma 检测规则 |
| rules/semgrep | 自写 Semgrep 规则 |
| scripts | 检测规则等价验证脚本 |

## 范围

只记录授权范围内的本地实验：VirtualBox 隔离虚拟机、DVWA/Juice Shop、断网与快照回滚、针对本地靶场的渗透复现。

## 不包含

恶意样本、虚拟机磁盘、凭证、token、内网地址、对第三方系统的扫描记录。

## 脱敏

目标地址统一用 TEST-NET 192.0.2.0/24，口令用 <redacted>，路径用 <workspace>。

## 许可

代码 MIT；文档与规则 CC BY 4.0。

仅用于授权的安全实验。未授权扫描或攻击他人系统违法。
