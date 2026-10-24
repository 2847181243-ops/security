# LAB-JUICE-SQLI-001 Juice Shop 登录 SQL 注入

- 对象：本地 OWASP Juice Shop（训练靶场）
- 类型：认证绕过
- 复现：POST /rest/user/login，email="' OR 1=1--"，password=x
- 证据：200，返回 admin JWT；报告 LAB-PT-004
- 影响：管理员会话接管
- 修复：参数化查询
- 置信度：高（未继续用令牌操作）
