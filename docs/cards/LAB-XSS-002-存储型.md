# LAB-XSS-002 DVWA 存储型 XSS

- 对象：本地 DVWA 1.10（训练靶场）
- 类型：存储型 XSS
- 复现：POST /vulnerabilities/xss_s/，mtxMessage=<script>alert(1)</script>，带 user_token
- 证据：响应原样回显脚本，STORED_XSS_OK；报告 LAB-PT-005
- 影响：持久化执行，访问留言板即触发
- 修复：存储/输出编码 + CSP
- 置信度：高
