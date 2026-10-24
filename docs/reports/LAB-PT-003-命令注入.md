# 实验报告：LAB-PT-003 DVWA 命令注入

## 文档控制

| 项 | 值 |
|---|---|
| 编号 | LAB-PT-003 |
| 日期 | 2026-10-24 |
| 执行 | lead（AI） |
| 分类 | 渗透测试 / Web |
| 风险级别 | 低 |
| 状态 | 完成 |

## 1. 目标

在本地 DVWA（low）复现命令注入，记录可复现证据。

## 2. 范围与环境

- 目标：DVWA 1.10 /vulnerabilities/exec/，labnet 主机 192.0.2.10:8080（脱敏）；
- 攻击机：lab-win PowerShell 会话；
- 只打本地靶场。

## 3. 假设

H1：ip 参数拼接进 shell 命令，可用分号追加命令。

## 4. 步骤

1. 登录并设 security=low；
2. 取 exec 页面 user_token；
3. POST body：ip=127.0.0.1;id、Submit=Submit、user_token；
4. 检查响应是否出现 uid=。

## 5. 结果

| 检查项 | 预期 | 实际 | 结论 |
|---|---|---|---|
| 执行 id | 返回 uid= | HTTP=200，uid=33(www-data) | 通过 |

## 6. 证据

- 证据文件：data/security/experiments/LAB-PT-003/evidence.txt；
- 脚本：lab/win_dvwa_cmd_evidence.ps1；
- 输出：HTTP=200、UID_LINE=uid=33(www-data)。

## 7. 分析

事实：分号后的 id 被执行；页面是 POST 表单，GET 方式不生效。推断：可直接在靶场容器内执行命令，风险高但范围限于 labnet。

## 8. 风险与影响

可读文件、起进程、横向；靶场隔离，未对外。

## 9. 修复与后续

- 修复：避免 shell 拼接，用参数化/白名单；
- 后续：做检测规则（进程创建/异常子进程）；
- 未解决：未测反弹 shell 或提权。

## 10. 结论

完成：命令注入复现。
