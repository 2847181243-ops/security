# 实验报告：LAB-PT-004 Juice Shop 登录 SQL 注入

## 文档控制

| 项 | 值 |
|---|---|
| 编号 | LAB-PT-004 |
| 日期 | 2026-10-24 |
| 执行 | lead（AI） |
| 分类 | 渗透测试 / Web |
| 风险级别 | 低 |
| 状态 | 完成 |

## 1. 目标

在本地 OWASP Juice Shop 上验证登录接口 SQL 注入，确认能否绕过认证。

## 2. 范围与环境

- 目标：Juice Shop 容器，http://192.0.2.10:3000（证据里的目标地址已脱敏）；
- 攻击机：lab-win PowerShell；
- 只打本地靶场，未使用返回的令牌访问其他资源。

## 3. 假设

H1：登录接口把 email 拼进 SQL，可用 OR 绕过。

## 4. 步骤

1. POST /rest/user/login；
2. body：{"email":"' OR 1=1--","password":"x"}；
3. 检查返回是否包含 authentication 令牌，并解码 JWT payload 看身份。

## 5. 结果

| 检查项 | 预期 | 实际 | 结论 |
|---|---|---|---|
| HTTP 状态 | 200 | 200 | 通过 |
| 返回 JWT | 有 | TOKEN_PRESENT=True；payload 中 email=admin@juice-sh.op、role=admin | 通过 |

## 6. 证据

- 证据文件：data/security/experiments/LAB-PT-004/evidence.txt；
- 脚本：lab/win_juice_sqli_evidence.ps1；
- 输出：HTTP=200、TOKEN_PRESENT=True、PAYLOAD 含 email=admin@juice-sh.op、role=admin；令牌原文未写入报告。

## 7. 分析

事实：payload 绕过登录并返回 admin 的 JWT。推断：可接管管理员会话；未继续用该令牌做后续操作。

## 8. 风险与影响

管理员会话被接管可读写用户数据；靶场隔离，风险受控。

## 9. 修复与后续

- 修复：参数化查询；
- 检测：登录接口异常参数/失败率规则；
- 未解决：未验证令牌权限范围。

## 10. 结论

通过：登录 SQL 注入复现。
