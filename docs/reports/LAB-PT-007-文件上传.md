# 实验报告：LAB-PT-007 DVWA 任意文件上传到 PHP 执行

## 文档控制

| 项 | 值 |
|---|---|
| 编号 | LAB-PT-007 |
| 日期 | 2026-10-24 |
| 执行 | lead（AI） |
| 分类 | 渗透测试 / Web |
| 风险级别 | 高（本地靶场） |
| 状态 | 完成 |

## 1. 目标

验证 DVWA（low）允许上传 PHP 并直接执行，形成 RCE 原语。

## 2. 范围与环境

- 目标：DVWA /vulnerabilities/upload/，labnet 主机 192.0.2.10:8080（脱敏）；
- 攻击机：lab-win，curl + cookie；
- 上传内容：只回显 upload-ok 的 PHP，不是后门。

## 3. 假设

H1：无扩展名/类型校验，PHP 可上传；H2：uploads 目录可执行 PHP。

## 4. 步骤

1. curl 登录并保存 cookie；
2. security=low；
3. 取 upload 页面 user_token；
4. curl -F 上传 upload-test.php；
5. 访问 /hackable/uploads/upload-test.php。

## 5. 结果

| 检查项 | 预期 | 实际 | 结论 |
|---|---|---|---|
| 上传 | 接受 | UPLOAD_OK=True（响应含 succes，非 not uploaded） | 通过 |
| 执行 | 输出 upload-evidence-ok | EXEC_BODY=upload-evidence-ok，PHP_EXECUTED=True | 通过 |

## 6. 证据

- 证据文件：data/security/experiments/LAB-PT-007/evidence.txt；
- 脚本：lab/win_dvwa_upload_evidence.ps1；
- 输出：UPLOAD_OK=True、EXEC_BODY=upload-evidence-ok；
- 文件：/hackable/uploads/upload-evidence.php（只回显）。

## 7. 分析

事实：PHP 上传后可直接执行，等价于容器内 RCE。推断：可进一步读文件/起进程，但未做。

## 8. 风险与影响

上传即代码执行，风险高于 LFI；靶场隔离，文件只回显。

## 9. 修复与后续

- 白名单扩展名 + 内容校验 + 上传目录禁执行；
- 检测：uploads 目录出现 .php 或被访问；
- 未解决：未测绕过（.phtml、双扩展名）。

## 10. 结论

完成：任意文件上传到 PHP 执行复现。
