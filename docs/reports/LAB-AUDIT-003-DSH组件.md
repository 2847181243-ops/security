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

事实：49 个文件被扫，0 命中，2 个错误都是 PartialParsing，位置在 dsh-api-workspace-files/lib/index.js。人工看了该文件：read/readBytes/stat 注释明确允许读 workspace 外文件（后端权限模型），list/changes 用 contains 限制目录在 workspace 内；未发现目录越权读。另看了 dsh-api-gateway/lib/index.js 的 prepareInvocation：非 owner principal 会走 remoteAccess.decide，owner 直接放行；未发现明显绕过。走读 dsh-onebot-qq 的 media.js：文件名由 UUID 生成、扩展名白名单、下载走私网 SSRF fence；未发现路径穿越或命令注入。SSRF fence 覆盖 0/10/127/172.16-31/192.168/169.254，但**没有 100.64.0.0/10（CGNAT）**；另外 lookup 后再 fetch 存在 DNS rebinding 的 TOCTOU 窗口。两者都未做动态验证，属代码层候选。推断：OWASP 规则覆盖有限，0 命中不等于安全。

## 8. 风险与影响

把 0 命中当安全结论会误导；需要动态测试和人工审计补充。onebot 的 CGNAT 缺口在部分云/运营商网络可成为 SSRF 跳板；DNS rebinding 需要攻击者控制 DNS 且目标二次解析，条件更高。

## 9. 修复与后续

- 对关键控制器做人工代码审计；
- 用动态请求测试鉴权/路径处理；
- 未解决：dsh-api-workspace-files/lib/index.js 部分解析，未覆盖全部包。

## 10. 结论

通过：扫描实际执行（49 文件），0 命中；不把 0 命中当安全结论。
