# 实验报告：LAB-PT-008 自建靶场 SSRF

## 文档控制

| 项 | 值 |
|---|---|
| 编号 | LAB-PT-008 |
| 日期 | 2026-10-24 |
| 执行 | lead（AI） |
| 分类 | 渗透测试 / Web |
| 风险级别 | 中（本地靶场） |
| 状态 | 完成 |

## 1. 目标

在自建 Node 靶场验证 SSRF：/fetch 接受用户 URL 并代理请求，访问内部服务。

## 2. 范围与环境

- 靶场：lab-win 内 lab webapp（127.0.0.1:8099）；
- 目标：同机 /metadata、labnet 上的 DVWA/Juice/CVE 容器；
- 只访问本地 labnet，不碰外网。

## 3. 假设

H1：/fetch 可访问应用自身 internal 端点；H2：可访问 labnet 其他服务。

## 4. 步骤

1. 给 server.mjs 加 /fetch?url= 与 /metadata；
2. 重启 Node；
3. 请求 /fetch?url=http://127.0.0.1:8099/metadata；
4. 请求 /fetch?url=http://192.0.2.10:8080/ 等三个端口。

## 5. 结果

| 目标 | 预期 | 实际 | 结论 |
|---|---|---|---|
| /metadata | 返回 internal secret | {"role":"internal","secret":"lab-only"} | 通过 |
| DVWA 8080 | 200 | 200 | 通过 |
| Juice 3000 | 200 | 200 | 通过 |
| CVE 8081 | 200 | 200 | 通过 |

## 6. 证据

- 脚本：lab/win_ssrf_test3.ps1；
- 输出：四个 URL 均 200；
- /metadata 返回 lab-only secret。

## 7. 分析

事实：服务端按用户 URL 发请求，内部服务可达。推断：可枚举内网、访问元数据；未做协议扩展（file/gopher）。

## 8. 风险与影响

SSRF 可做内网探测和横向入口；靶场隔离。

## 9. 修复与后续

- 修复：URL 白名单、禁内网地址、禁重定向、限制 scheme；
- 检测：/fetch 参数含 127.0.0.1、169.254、内网段；
- 未解决：未测 DNS rebinding、云元数据地址。

## 10. 结论

完成：SSRF 复现。
