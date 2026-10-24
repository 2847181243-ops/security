# 实验报告：LAB-AUDIT-009 OneBot 媒体链审计

## 文档控制

| 项 | 值 |
|---|---|
| 编号 | LAB-AUDIT-009 |
| 日期 | 2026-10-25 |
| 执行 | lead（AI） |
| 分类 | 代码审计 + 动态验证 |
| 风险级别 | 中（本地验证） |
| 状态 | 完成（远程可达性部分未确认） |

## 1. 目标

审 dsh-onebot-qq 0.9.6 的媒体解析/下载链，确认地址过滤与 file:// 处理是否可绕过。

## 2. 范围与环境

- 插件：profiles/desktop/node_modules/dsh-onebot-qq 0.9.6；上游 main 分支 media.js 逻辑相同，上游版本号未核对；
- 方法：读 media.js/inbound.js，复制 lib 为 ESM 副本，用 fetch stub 动态调用 MediaStore；
- 只读公网/本地自建 proof 文件，不访问真实内网目标。

## 3. 假设

H1：SSRF fence 覆盖所有私网/保留段；H2：file:// ref 只允许可信来源。

## 4. 步骤

1. 读 isPrivateIpv4/isPrivateIpv6/assertDownloadableUrl/resolveInner；
2. 构造 10/127/192.168/169.254/100.64/240/198.18/192.0.0.1 与 IPv6 地址，记录是否到 fetch；
3. 测重定向到私网/CGNAT；
4. 用 MediaStore.resolve 传 file:// proof 文件，看是否复制。

## 5. 结果

| 测试 | 结果 |
|---|---|
| 10/127/192.168/169.254 | fetch 前拒绝 |
| 100.64/10、240/4、198.18/15、192.0.0.1（各测一个代表地址） | 到达 fetch |
| [::ffff:100.64.1.2]、[64:ff9b::7f00:1] | 到达 fetch |
| 302 到 127.0.0.1 | 第二跳前拒绝 |
| 302 到 100.64.1.2 | 继续跟随到跳数上限 |
| file:// proof | resolved=true，内容复制到媒体目录 |

## 6. 证据

- 证据文件：data/security/experiments/LAB-AUDIT-009/evidence.txt；
- 脚本（repo 内可复跑，含 onebot-esm 副本）：scripts/test_cgnat.mjs、test_fence_matrix.mjs、test_fence_v6.mjs、test_fence_redirect.mjs、test_file_ref.mjs；本地 lab/fuzz 有同名副本；
- 补丁：docs/security/patches/onebot-cgnat-fix.diff（repo 内为 docs/patches/onebot-cgnat-fix.diff，副本验证）；
- advisory：advisories/2026-10-25-onebot-cgnat-ssrf*.md、2026-10-25-onebot-file-read.md。

## 7. 分析

事实：fence 对常规私网有效，对 CGNAT/保留段/NAT64 无效；file:// 分支无路径限制。推断：SSRF 缺口在把 CGNAT 当内网的部署里可被消息 URL 利用；file:// 需要事件源能控制 file 字段，普通 NapCat 消息是否可达未证实。

## 8. 风险与影响

SSRF 可访问部署内本不可达服务；file:// 可读本地文件，但远程前置条件高。两者都未做真实内网利用。

## 9. 修复与后续

- 应用补丁：IPv4 四段 + IPv6 NAT64；
- inbound 拒绝 file://，或限制到媒体根目录并做 realpath 校验；
- DNS rebinding 固定解析 IP（设计已写，未实现）；
- 未解决：QQ 消息到 file:// 的真实可达性、上游披露未发。

## 10. 结论

通过：两条问题都有动态证据；SSRF 为确认的地址过滤绕过，file:// 为本地确认、远程待证。
