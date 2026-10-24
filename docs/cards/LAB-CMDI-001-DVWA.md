# LAB-CMDI-001 DVWA 命令注入

- 对象：本地 DVWA 1.10（训练靶场）
- 类型：命令注入
- 复现：POST /vulnerabilities/exec/，ip=127.0.0.1;id，带 user_token
- 证据：响应出现 uid=，CMD_INJECTION_OK；报告 LAB-PT-003
- 影响：容器内命令执行
- 修复：避免 shell 拼接，白名单/参数化
- 置信度：高（未测提权/横向）
