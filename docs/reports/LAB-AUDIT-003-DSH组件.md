# 实验报告：LAB-AUDIT-003 DSH 组件静态审计

## 文档控制

| 项 | 值 |
|---|---|
| 编号 | LAB-AUDIT-003 |
| 日期 | 2026-10-25 |
| 执行 | lead（AI） |
| 分类 | 静态审计 |
| 风险级别 | 低 |
| 状态 | 完成 |

## 1. 目标

对本地 DSH 安装的安全相关包做静态扫描，建立第三方组件审计基线。

## 2. 范围与环境

- 先解包 resources/app.asar 到 data/security/dsh-app（182MB 包，49 个文件被扫）；
- 目标：@deepseek-ai 下 dsh-api-gateway、dsh-api-workspace-files、dsh-host-webserver；
- Semgrep 1.182.1，规则 p/owasp-top-ten；
- 只读，未改安装目录。

## 3. 假设

H1：解包后能正常扫描；H2：可能有路径/上传/鉴权类问题。

## 4. 步骤

1. 用 @electron/asar 解包 app.asar；
2. semgrep scan --config p/owasp-top-ten 三个包；
3. 记录 results/errors/scanned；
4. 逐条看命中。

## 5. 结果

| 扫描 | 文件 | 命中 | 错误 |
|---|---|---|---|
| OWASP Top Ten | 49 | 0 | 2 |

早期直接扫 app.asar 内部路径时 scanned=0（Invalid scanning root），本次解包后真正执行。

## 6. 证据

- 证据文件：data/security/experiments/LAB-AUDIT-003/evidence.txt；
- JSON：data/security/semgrep-dsh-real.json；
- 解包目录：data/security/dsh-app（本地，未入库）。

## 7. 分析

事实：49 个文件被扫，0 命中，2 个错误都是 PartialParsing，位置在 dsh-api-workspace-files 的 lib/index.js 与 lib/types/index.js。人工看了该文件：read/readBytes/stat 注释明确允许读 workspace 外文件（后端权限模型），list/changes 用 contains 限制目录在 workspace 内；未发现目录越权读。另看了 dsh-api-gateway/lib/index.js 的 prepareInvocation：非 owner principal 会走 remoteAccess.decide，owner 直接放行；未发现明显绕过。走读 dsh-client-connection/lib/index.js：browserPeer 的 principal 是 owner，但 admit() 先过 isTrusted（Host/Origin fence），再过 browserAuth 认证/API token，未认证直接 401/403；cookie 由 launch token 换取、HMAC 签名、绑定 authority 和过期时间；未发现无认证拿 owner 的路径。走读 dsh-onebot-qq 的 media.js：文件名由 UUID 生成、扩展名白名单、下载走私网 SSRF fence；未发现路径穿越或命令注入。SSRF fence 覆盖 0/8、10/8、127/8、172.16/12、192.168/16、169.254/16，但**没有 100.64.0.0/10（CGNAT）**；已动态验证：10/127/192.168/169.254 在 fetch 前被拒；100.64/10、240/4、198.18/15、192.0.0.1、[::ffff:100.64.1.2] 均可到达 fetch 层；IPv6 的 [64:ff9b::7f00:1]（NAT64 映射 127.0.0.1）和 [2001:db8::1] 也通过；重定向到 127.0.0.1 会在第二跳前被拒，重定向到 100.64.1.2 会被继续跟随到跳数上限。DNS rebinding 的 TOCTOU 窗口仍未动态验证。补丁（加 100.64/10、198.18/15、192.0.0/24、240/4）在副本上验证有效，见 docs/security/patches/onebot-cgnat-fix.diff。推断：OWASP 规则覆盖有限，0 命中不等于安全。

## 8. 风险与影响

把 0 命中当安全结论会误导；需要动态测试和人工审计补充。onebot 的 CGNAT 缺口已动态确认可绕过 fence（在 100.64/10 用于内部的网络里可成为 SSRF 跳板）；DNS rebinding 仍是代码层候选。

## 9. 修复与后续

- 对关键控制器做人工代码审计；
- 用动态请求测试鉴权/路径处理；
- 未解决：dsh-api-workspace-files/lib/index.js 部分解析，未覆盖全部包；client-connection 的 cookie 签名/比较实现被 DSH defend 判为 secret，当前通道读不到，未审。

## 10. 结论

通过：扫描实际执行（49 文件），0 命中；不把 0 命中当安全结论。
