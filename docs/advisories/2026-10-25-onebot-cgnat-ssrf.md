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
- 在副本上应用补丁后重测：上述段全部被拒，100.128.0.1 仍可访问；IPv6 增加 64:ff9b::/96 拒绝后 [64:ff9b::7f00:1] 也被拒；
- 下载时固定 lookup 得到的 IP（连接该 IP，Host 头保留域名），避免二次解析。

## 证据

- 动态测试：downloadUrl 对 10/127/192.168/169.254 在 fetch 前拒绝，100.64.1.2 到达 fetch；
- 代码：profiles/desktop/node_modules/dsh-onebot-qq/lib/media.js，isPrivateIpv4 约 255-265 行，assertDownloadableUrl 约 220-247 行；
- 报告：LAB-AUDIT-003。

## 上游仓库

- package.json 的 repository: github.com/mario841859784/dsh-onebot；上游 main 分支 media.js 已拉取核对，isPrivateIpv4 仍是同样的六段，缺口未修；
- 仓库是公开仓库、issues 开启，最近 push 2026-10-24；GitHub 搜索 SSRF/media 相关 issue 均为 0 条；未联系作者；
- 上游 private vulnerability reporting 为 disabled，GitHub 私密 advisory 不可用；可先开一个不含细节的 issue 请求私密渠道，或通过仓库 owner 主页联系方式；先给 90 天修复窗口。

## 约束

- 不提供可直接利用的完整 exploit；
- 未联系上游作者；如需披露，先走插件仓库 security 渠道。

## TOCTOU 设计（未实现）

- 解析一次，校验所有地址，选一个公网 IP；
- 用 undici Agent 的 connect.lookup 固定返回该 IP，fetch 时传 dispatcher；
- HTTPS 保留 Host/SNI 为原域名，避免证书错误；
- 每次重定向重新解析并重新固定，不复用旧 IP；
- 未写代码、未测试，仅方案。

## 联系 issue 草稿（未发）

标题：Request a private security contact

正文：Hi，我在本地审计 0.9.6 的媒体下载/SSRF 过滤，发现一个地址校验缺口，能提供复现和补丁。仓库的 private vulnerability reporting 是关的；能否给一个私密渠道，或开一个临时 advisory？收到后我会附最小 PoC 和修复建议。
