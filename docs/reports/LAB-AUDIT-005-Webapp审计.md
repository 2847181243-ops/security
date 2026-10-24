# 实验报告：LAB-AUDIT-005 自建 webapp 人工审计

## 文档控制

| 项 | 值 |
|---|---|
| 编号 | LAB-AUDIT-005 |
| 日期 | 2026-10-24 |
| 执行 | lead（AI） |
| 分类 | 静态/人工审计 |
| 风险级别 | 低（训练靶场） |
| 状态 | 完成 |

## 1. 目标

按漏洞挖掘清单审 lab/webapp，记录设计内的漏洞与代码缺陷。

## 2. 范围与环境

- lab/webapp/server.mjs，127.0.0.1:8099；
- 只读代码 + 本地请求，不打外部。

## 3. 假设

H1：训练靶场保留 XSS/SQLi/SSRF/IDOR；H2：文件读取可能缺少路径约束。

## 4. 步骤

1. 读 server.mjs 路由；
2. 请求 /file、/idor、/xss、/login、/fetch；
3. 记录响应。

## 5. 结果

| 项 | 结果 | 判断 |
|---|---|---|
| /xss | 200，脚本原样回显 | 设计内反射 XSS |
| /idor?id=2 | 200，返回 bob/admin | 设计内越权 |
| /file?name=public.txt | 200 | 正常 |
| /file 路径穿越 | 多次 ../ 均 404 | 代码无 containment 检查，但本轮未打通 |
| /fetch | 可访问内部 URL | 设计内 SSRF |

## 6. 证据

- 脚本：runtime/security/audit_webapp.mjs、audit_webapp2.mjs；
- 代码：lab/webapp/server.mjs。

## 7. 分析

事实：XSS、IDOR、SSRF 按设计存在；/file 用 path.join(ROOT,"files",name) 没有校验解析后路径是否在 files 下，属代码缺陷，但本轮路径未打通，未验证可利用。

## 8. 风险与影响

训练靶场故意保留漏洞；若照搬到生产，XSS/SSRF/路径穿越都会成立。

## 9. 修复与后续

- 生产版加路径规范化 + 前缀校验；
- 输入输出编码、URL 白名单；
- 未解决：路径穿越未验证。

## 10. 结论

完成：记录 3 个设计内漏洞和 1 个未验证的路径校验缺陷。
