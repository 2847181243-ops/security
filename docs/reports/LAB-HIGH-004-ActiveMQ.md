# 实验报告：LAB-HIGH-004 CVE-2023-46604 ActiveMQ OpenWire RCE

## 文档控制

| 项 | 值 |
|---|---|
| 编号 | LAB-HIGH-004 |
| 日期 | 2026-10-24 |
| 执行 | lead（AI） |
| 分类 | 高危漏洞复现 |
| 风险级别 | 高（本地靶场） |
| 状态 | 完成 |

## 1. 目标

在 labnet 内复现 CVE-2023-46604：ActiveMQ OpenWire 反序列化导致远程代码执行。

## 2. 范围与环境

- lab-linux + Docker，镜像 vulhub/activemq:5.17.3；
- 容器 activemq，61616（OpenWire）、8161（Web）；
- 验证器 activemq_validator.py v1.0.0，只做固定 XML 加载与固定身份命令（id/whoami/hostname/uname），不提供反弹 shell；
- 拉镜像时临时 NAT，验证后撤掉，只保留 labnet。

## 3. 假设

H1：OpenWire 的 ExceptionResponse 可加载攻击者 XML；H2：XML 中的 bean 可执行固定命令。

## 4. 步骤

1. 拉镜像并 run -p 61616:61616 -p 8161:8161；
2. 用 validator 的 xml 模式，回调服务器提供 XML；
3. 观察 ActiveMQ 是否回连取 XML；
4. 用 rce 模式，执行固定 id/hostname/whoami 命令并取回输出。

## 5. 结果

| 检查项 | 预期 | 实际 | 结论 |
|---|---|---|---|
| XML 加载 | 回连 | CONFIRMED_VULNERABLE_XML_LOAD，XML=1 | 通过 |
| 固定命令 | 返回 uid | CONFIRMED_VULNERABLE_RCE，uid=0(root)、user=root | 通过 |

## 6. 证据

- 证据文件：data/security/experiments/CVE-2023-46604/evidence.txt；
- XML 原始 CSV：data/security/experiments/CVE-2023-46604/proof.csv；
- RCE CSV：data/security/experiments/CVE-2023-46604/rce.csv；
- 输出：CVE-2023-46604 RCE CONFIRMED | uid=0(root) gid=0(root) groups=0(root) | user=root | host=3b89b15c...；
- 容器：vulhub/activemq:5.17.3，0.0.0.0:61616->61616。

## 7. 分析

事实：ActiveMQ 加载了攻击者提供的 XML，并执行了固定身份命令，返回 root。推断：同路径可执行任意命令，但本轮只跑固定命令，未做反弹 shell 或横向。

## 8. 风险与影响

OpenWire 默认端口 61616 常在内网暴露；成功利用即容器内 root，CVSS 10.0。靶场隔离，未触碰外部。

## 9. 修复与后续

- 升级 ActiveMQ 到修复版本；限制 61616 访问；
- 检测：OpenWire 异常类加载、61616 异常连接；
- 未解决：未测横向、未做持久化。

## 10. 结论

通过：XML 加载与固定命令执行均确认，CVE-2023-46604 复现成功。
