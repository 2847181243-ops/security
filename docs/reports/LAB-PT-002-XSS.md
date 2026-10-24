# 实验报告：LAB-PT-002 DVWA 反射型 XSS

## 文档控制

| 项 | 值 |
|---|---|
| 编号 | LAB-PT-002 |
| 日期 | 2026-10-24 |
| 执行 | lead（AI） |
| 分类 | 渗透测试 / Web |
| 风险级别 | 低 |
| 状态 | 完成 |

## 1. 目标

在本地 DVWA（low）复现反射型 XSS，记录请求与回显证据。

## 2. 范围与环境

- 目标：DVWA 1.10，http://192.0.2.10:8080（脱敏地址）；
- 攻击机：lab-win，PowerShell WebRequestSession；
- 只打本地靶场。

## 3. 假设

H1：name 参数未编码，脚本原样回显。

## 4. 步骤

1. 登录 admin（带 user_token）；
2. 设置 security=low（seclev_submit）；
3. 取 /vulnerabilities/xss_r/ 页面 token；
4. 请求带 payload 的 name 参数；
5. 检查响应是否含原始脚本。

## 5. 结果

| 检查项 | 预期 | 实际 | 结论 |
|---|---|---|---|
| 回显原始脚本 | 出现 script 标签 | XSS_REFLECTED | 通过 |

## 6. 证据

- 脚本：lab/win_dvwa_xss.ps1；
- 输出：XSS_REFLECTED。

## 7. 分析

事实：响应包含未编码的脚本标签。推断：浏览器会执行，属于反射型 XSS；只在本地靶场验证。

## 8. 风险与影响

可窃取会话/发起操作；靶场隔离，风险受控。

## 9. 修复与后续

- 修复：输出编码 + CSP；
- 后续：试 stored XSS（需留言板写入），或做检测规则。

## 10. 结论

完成：反射型 XSS 复现。
