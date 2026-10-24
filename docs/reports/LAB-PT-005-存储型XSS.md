# 实验报告：LAB-PT-005 DVWA 存储型 XSS

## 文档控制

| 项 | 值 |
|---|---|
| 编号 | LAB-PT-005 |
| 日期 | 2026-10-24 |
| 执行 | lead（AI） |
| 分类 | 渗透测试 / Web |
| 风险级别 | 低 |
| 状态 | 完成 |

## 1. 目标

在本地 DVWA（low）验证存储型 XSS：留言写入后原样回显脚本。

## 2. 范围与环境

- 目标：DVWA /vulnerabilities/xss_s/，labnet 主机 192.0.2.10:8080（脱敏）；
- 攻击机：lab-win PowerShell 会话；
- 只打本地靶场。

## 3. 假设

H1：留言内容未编码，写入后页面直接渲染脚本。

## 4. 步骤

1. 登录 admin，security=low；
2. 取 xss_s 页面 user_token；
3. POST txtName=tester、mtxMessage=<script>alert(1)</script>、btnSign=Sign Guestbook、user_token；
4. 再 GET 一次页面，确认脚本已存储并再次渲染。

## 5. 结果

| 检查项 | 预期 | 实际 | 结论 |
|---|---|---|---|
| POST 后回显 | 原始 script | STORED_XSS_OK | 通过 |
| 二次 GET 仍在 | 脚本仍在页面 | STORED_CONFIRMED=True | 通过 |

## 6. 证据

- 证据文件：data/security/experiments/LAB-PT-005/evidence.txt；
- 脚本：lab/win_dvwa_stored_evidence.ps1；
- 输出：POST_HTTP=200、GET_HTTP=200、STORED_CONFIRMED=True。

## 7. 分析

事实：留言写入后页面渲染未编码脚本。推断：任何访问留言板的用户都会执行，危害比反射型更持久。

## 8. 风险与影响

持久化脚本可窃取会话、钓鱼；靶场隔离。

## 9. 修复与后续

- 修复：存储前编码/过滤 + CSP；
- 检测：留言内容出现 script 标签；
- 未解决：未清理测试留言。

## 10. 结论

完成：存储型 XSS 复现。
