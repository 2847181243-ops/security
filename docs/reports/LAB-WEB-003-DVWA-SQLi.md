# 实验报告：LAB-WEB-003 DVWA SQL 注入练习

## 文档控制

| 项 | 值 |
|---|---|
| 编号 | LAB-WEB-003 |
| 日期 | 2026-10-24 |
| 执行 | lead（AI） |
| 分类 | 靶场练习 |
| 风险级别 | 低 |
| 状态 | 完成 |

## 1. 目标

在本地 DVWA（low）上复现一次 SQL 注入，记录可复现证据。

## 2. 范围与环境

- DVWA 1.10 容器，http://192.0.2.10:8080（脱敏地址）；
- 从 Windows VM 用 PowerShell 会话访问；
- 只打本地靶场。

## 3. 假设

H1：id=1' OR '1'='1 能返回多行用户；H2：安全级别 low 可切换。

## 4. 步骤

1. 登录 admin/<redacted>（带 CSRF token）；
2. POST security.php：security=low、seclev_submit=Submit、user_token；
3. 请求 /vulnerabilities/sqli/?id=1&Submit=Submit；
4. 请求注入 payload。

## 5. 结果

| 检查项 | 预期 | 实际 | 结论 |
|---|---|---|---|
| 登录 | 成功 | LOGIN_OK=True（INDEX_OK 未单独记录） | 通过 |
| 安全级别 | low | LEVEL=low | 通过 |
| 正常查询 id=1 | 返回 1 行 | ID1_COUNT=1 | 通过 |
| 注入 payload | 返回多行 | PAYLOAD_COUNT=5，命中 pablo | 通过 |

## 6. 证据

- 证据文件：data/security/experiments/LAB-WEB-003/evidence.txt；
- 脚本：lab/win_dvwa_sqli_evidence.ps1（含 security=low 步骤）；
- 输出：ID1_COUNT=1、PAYLOAD_COUNT=5、HIT=pablo。

## 7. 分析

早期失败运行的输出未存证；补 token 并确认 security=low 后，id=1 返回 1 行，payload 返回 5 行（见 evidence.txt）。数据库本身正常（5 个用户）。

## 8. 风险与影响

如果靶场本身不返回数据，练习结论无效；不能拿它当“已复现漏洞”。

## 9. 修复与后续

- 立即动作：检查容器日志和 DB 表；
- 备选：改用 Juice Shop 的 API 练习；
- 未解决：无（已复现）。

## 10. 结论

通过：本地 DVWA low 级别 SQL 注入复现，payload 返回 5 行。
