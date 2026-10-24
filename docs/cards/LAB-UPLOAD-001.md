# LAB-UPLOAD-001 DVWA 任意文件上传

- 对象：本地 DVWA 1.10（训练靶场）
- 类型：任意文件上传 / RCE
- 复现：登录 low，POST /vulnerabilities/upload/ 上传 upload-test.php，访问 /hackable/uploads/upload-test.php
- 证据：UPLOAD_ACCEPTED、PHP_EXECUTED；报告 LAB-PT-007
- 影响：上传即代码执行
- 修复：扩展名白名单、内容校验、上传目录禁执行
- 置信度：高（未测扩展名绕过）
