# LAB-SQLI-001 DVWA SQL 注入

- 对象：本地 DVWA 1.10（训练靶场，非真实产品）
- 类型：SQL 注入
- 复现：登录 admin，security=low，带 user_token 请求 /vulnerabilities/sqli/?id=1%27%20OR%20%271%27%3D%271
- 证据：正常 id=1 返回 1 行；payload 返回 5 行（admin/gordonb/1337/pablo/smithy）；报告 LAB-WEB-003
- 影响：可读 users 表，进一步可拖库
- 修复：参数化查询；最小权限 DB 用户
- 置信度：高（本地可重复）
