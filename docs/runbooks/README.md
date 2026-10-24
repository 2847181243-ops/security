# 安全复现 Runbook 索引

| 编号 | CVE | 状态 | 关键证据 |
|---|---|---|---|
| LAB-HIGH-001 | CVE-2021-41773 | 完成（路径穿越 + CGI RCE） | data/security/experiments/CVE-2021-41773/evidence.txt |
| LAB-HIGH-002 | CVE-2022-22965 | 完成（写 JSP 回显 poc-ok） | data/security/experiments/CVE-2022-22965/evidence.txt |
| LAB-HIGH-003 | CVE-2021-44228 | 部分完成（JNDI 回调，无 RCE） | data/security/experiments/CVE-2021-44228/evidence.txt |
| LAB-HIGH-004 | CVE-2023-46604 | 完成（固定命令，uid=0） | data/security/experiments/CVE-2023-46604/evidence.txt |
| LAB-HIGH-005 | CVE-2016-3081 | 完成（固定回调） | data/security/experiments/LAB-HIGH-005/evidence.txt |
| LAB-HIGH-006 | CVE-2017-12615 | 完成（PUT 写 JSP） | data/security/experiments/LAB-HIGH-006/evidence.txt |

## 使用约定

- 只在本机 labnet / host-only 内执行；
- 每次先确认 VM 网络，结束撤 NAT、恢复 nic1 intnet/labnet、nic3 none；
- 不写后门、不做反弹 shell、不横向；
- 报告和证据路径必须存在，结构检查过 accept_reports.mjs。
