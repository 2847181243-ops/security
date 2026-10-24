# LAB-LFI-001 DVWA 本地文件包含

- 对象：本地 DVWA 1.10（训练靶场）
- 类型：LFI / 路径穿越
- 复现：/vulnerabilities/fi/?page=../../../../../etc/passwd，带 user_token
- 证据：响应含 root:x:0:0，LFI_OK；报告 LAB-PT-006
- 影响：读取容器内敏感文件，可能进一步 RCE
- 修复：页面白名单 + realpath 校验
- 置信度：高（未测 RCE）
