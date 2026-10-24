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

- DVWA 1.10 容器，http://192.0.2.10:8080；
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
| 登录 | 成功 | LOGIN_OK、INDEX_OK | 通过 |
| 安全级别 | low | LEVEL=low | 通过 |
| 正常查询 id=1 | 返回 1 行 | NAME_COUNT=1，admin | 通过 |
| 注入 payload | 返回多行 | NAME_COUNT=5，命中 admin/pablo | 通过 |

## 6. 证据

- 脚本：lab/win_dvwa_sqli*.ps1；
- 输出：LEVEL=low；FIRSTNAME_COUNT=0；响应长度 4560。

## 7. 分析

之前失败原因是 SQLi 表单带 hidden user_token，请求没带 token 被拒；补上 token 后 id=1 返回 1 行，payload 返回 5 行。数据库本身正常（5 个用户）。

## 8. 风险与影响

如果靶场本身不返回数据，练习结论无效；不能拿它当“已复现漏洞”。

## 9. 修复与后续

- 立即动作：检查容器日志和 DB 表；
- 备选：改用 Juice Shop 的 API 练习；
- 未解决：无（已复现）。

## 10. 结论

通过：本地 DVWA low 级别 SQL 注入复现，payload 返回 5 行。
