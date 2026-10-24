# LAB-SSRF-001 自建靶场 SSRF

- 对象：本地 lab webapp /fetch（训练靶场）
- 类型：SSRF
- 复现：/fetch?url=http://192.0.2.10:8080/，返回 200；/fetch?url=.../metadata 返回内部 secret
- 证据：四个内部 URL 均 200；报告 LAB-PT-008
- 影响：内网探测、访问内部服务
- 修复：URL 白名单、禁内网/重定向/危险 scheme
- 置信度：高（未测 DNS rebinding）
