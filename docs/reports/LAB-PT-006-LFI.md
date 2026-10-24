# 实验报告：LAB-PT-006 DVWA 本地文件包含

## 文档控制

| 项 | 值 |
|---|---|
| 编号 | LAB-PT-006 |
| 日期 | 2026-10-24 |
| 执行 | lead（AI） |
| 分类 | 渗透测试 / Web |
| 风险级别 | 低 |
| 状态 | 完成 |

## 1. 目标

在本地 DVWA（low）验证本地文件包含（LFI），读取容器内 /etc/passwd。

## 2. 范围与环境

- 目标：DVWA /vulnerabilities/fi/；
- 攻击机：lab-win PowerShell；
- 只读 /etc/passwd，不写文件、不执行。

## 3. 假设

H1：page 参数拼接路径，可用 ../ 跳出 Web 根目录。

## 4. 步骤

1. 登录 admin，security=low；
2. 取 fi 页面 user_token；
3. 请求 page=..%2F..%2F..%2F..%2F..%2Fetc%2Fpasswd（5 层，URL 编码）；
4. 检查响应是否含 root:x:0:0。

## 5. 结果

| 检查项 | 预期 | 实际 | 结论 |
|---|---|---|---|
| 读 /etc/passwd | 出现 root:x:0:0 | HTTP=200，PASSWD_LINE=root:x:0:0:root:/root:/bin/bash | 通过 |

## 6. 证据

- 证据文件：data/security/experiments/LAB-PT-006/evidence.txt；
- 脚本：lab/win_dvwa_lfi_evidence.ps1；
- 输出：HTTP=200，PASSWD_LINE=root:x:0:0:root:/root:/bin/bash。

## 7. 分析

事实：5 层 ../ 读到 /etc/passwd。推断：可读应用配置/密钥；未尝试包含日志或 RCE。

## 8. 风险与影响

敏感文件泄露，可能进一步 RCE；靶场隔离。

## 9. 修复与后续

- 修复：白名单页面、realpath 校验；
- 检测：请求出现大量 ../；
- 未解决：未测日志包含/RCE。

## 10. 结论

通过：LFI 复现。
