# SQL 注入：/login 字符串拼接可绕过

- 对象：自建训练靶场 lab/webapp（非真实产品）
- 类型：训练用自建代码，不是真实产品漏洞
- 复现：`GET /login?user=' OR '1'='1&pass=x`
- 证据：`返回 logged in as admin (injection)，并回显拼接后的 SQL`
- 影响：绕过认证，读到 admin 权限
- 修复：参数化查询；不把 SQL 回显给用户
- 置信度：高（本地可重复）
- 备注：仅用于本地靶场教学；不针对任何第三方系统。
