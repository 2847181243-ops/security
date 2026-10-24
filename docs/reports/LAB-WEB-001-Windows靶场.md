# 实验报告：LAB-WEB-001 Windows VM 内 Web 靶场

## 文档控制

| 项 | 值 |
|---|---|
| 编号 | LAB-WEB-001 |
| 日期 | 2026-10-24 |
| 执行 | lead（AI） |
| 分类 | 靶场部署 |
| 风险级别 | 低 |
| 状态 | 完成 |

## 1. 目标

在断网 Windows VM 内跑一个可控的脆弱 Web 应用，用于 XSS/SQLi/路径穿越/IDOR 练习。

## 2. 范围与环境

- lab-win，weblab-base 快照；
- Node v24.10.0 zip + 自写 `lab/webapp/server.mjs`；
- 只监听 127.0.0.1:8099。

## 3. 假设

H1：VM 内可启动 Node 服务；H2：四个漏洞可复现。

## 4. 步骤

1. 宿主下载 Node zip，guestcontrol 拷入 C:\lab；
2. Expand-Archive 解压；
3. 拷入 server.mjs 与 files/；
4. 启动 node；
5. 用 Invoke-WebRequest 验证。

## 5. 结果

| 检查项 | 预期 | 实际 | 结论 |
|---|---|---|---|
| 主页 | 200 | 返回 lab webapp HTML | 通过 |
| IDOR | admin 数据 | {"id":2,"name":"bob","role":"admin"} | 通过 |
| XSS/SQLi/穿越 | 可复现 | 宿主同代码验证 | 通过 |

## 6. 证据

- `docs/security/Web靶场部署.md`；
- 漏洞卡 `docs/security/vuln-cards/`；
- 快照 weblab-base UUID 16276481-e682-4fa1-af5f-46055204173f。

## 7. 分析

自建代码便于控制变量；不代表真实产品漏洞。

## 8. 风险与影响

只在本机 VM 内监听 loopback，未接外网；如果暴露到 labnet，其他 VM 可访问，需要鉴权或断网。

## 9. 修复与后续

- 后续：把服务改为只绑 labnet 并在报告里记录访问范围。

## 10. 结论

通过。
