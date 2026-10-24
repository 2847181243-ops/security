# Advisory（内部/未验证）：dsh-onebot-qq SSRF fence 未覆盖 CGNAT

## 基本信息

- 组件：dsh-onebot-qq（本地安装的 DSH 插件）
- 版本：dsh-onebot-qq 0.9.6（npm 最新也是 0.9.6，缺口未在上游修复）
- 发现者：lead（AI）
- 日期：2026-10-25
- 状态：动态验证（fence 对 100.64.1.2 放行到 fetch 层），未对外披露

## 问题

- media.js 的 isPrivateIpv4 覆盖 0/8、10/8、127/8、172.16/12、192.168/16、169.254/16；
- 未覆盖 100.64.0.0/10（CGNAT）、240.0.0.0/4（保留）、198.18.0.0/15（基准测试）、192.0.0.0/24（IETF 协议）；
- 动态测试中这些段和 [::ffff:100.64.1.2] 都能到达 fetch 层；重定向到 127.0.0.1 会被拒，重定向到 100.64.1.2 会被继续跟随；IPv6 的 [64:ff9b::7f00:1]（NAT64 映射 127.0.0.1）和 [2001:db8::1] 也通过；10/127/192.168/169.254/localtest.me/2130706433 被拒；
- assertDownloadableUrl 先 lookup 再 fetch，存在 DNS rebinding TOCTOU 窗口。

## 影响

- 若部署网络把 100.64/10 用于内部服务，发送者可控 URL 可能绕过私网检查；
- DNS rebinding 需要攻击者控制域名且命中二次解析，条件更高。

## 建议修复

- 在 isPrivateIpv4 增加 100.64/10、198.18/15、192.0.0/24、240/4；补丁见 docs/security/patches/onebot-cgnat-fix.diff；
- 在副本上应用补丁后重测：上述段全部被拒，100.128.0.1 仍可访问；
- 下载时固定 lookup 得到的 IP（连接该 IP，Host 头保留域名），避免二次解析。

## 证据

- 动态测试：downloadUrl 对 10/127/192.168/169.254 在 fetch 前拒绝，100.64.1.2 到达 fetch；
- 代码：profiles/desktop/node_modules/dsh-onebot-qq/lib/media.js，isPrivateIpv4 约 255-265 行，assertDownloadableUrl 约 220-247 行；
- 报告：LAB-AUDIT-003。

## 约束

- 不提供可直接利用的完整 exploit；
- 未联系上游作者；如需披露，先走插件仓库 security 渠道。
