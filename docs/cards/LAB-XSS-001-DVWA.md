# LAB-XSS-001 DVWA 反射型 XSS

- 对象：本地 DVWA 1.10（训练靶场）
- 类型：反射型 XSS
- 复现：/vulnerabilities/xss_r/?name=%3Cscript%3Ealert(1)%3C%2Fscript%3E，带 user_token
- 证据：响应原样回显 script，XSS_REFLECTED；报告 LAB-PT-002
- 影响：可执行脚本、窃取会话
- 修复：输出编码 + CSP
- 置信度：高
