# 厂商报告草稿：dsh-onebot-qq SSRF 地址过滤缺口

## 摘要

dsh-onebot-qq 的媒体下载 SSRF fence（lib/media.js / isPrivateIpv4）只覆盖 0/8、10/8、127/8、172.16/12、192.168/16、169.254/16；100.64.0.0/10（CGNAT）、240.0.0.0/4、198.18.0.0/15、192.0.0.0/24、IPv4-mapped CGNAT 和 NAT64 64:ff9b::/96 未被拦截。

## 影响

在把上述网段用于内部服务的部署里，消息发送者提供的 URL 可绕过私网检查，访问本应不可达的目标。属于 SSRF 地址过滤绕过；具体影响取决于部署网络。

## 复现（无外部目标）

1. 加载 lib/media.js，构造 MediaStore，allowPrivateHosts=false；
2. 用 fetch stub 记录是否到达网络层；
3. 请求 http://10.0.0.1/ 被拒；http://100.64.1.2/ 到达 fetch；
4. IPv6：[::ffff:100.64.1.2]、[64:ff9b::7f00:1] 也到达 fetch。

只在本地做，未访问真实内网目标。

## 建议修复

- isPrivateIpv4 增加 100.64/10、198.18/15、192.0.0/24、240/4；
- isPrivateIpv6 拒绝 64:ff9b::/96；
- 下载时固定 DNS 解析结果（见 TOCTOU 设计），每次重定向重新固定。

补丁：docs/security/patches/onebot-cgnat-fix.diff（在副本上验证有效）。

## 版本

- 本地 npm：0.9.6；
- 上游 main：media.js 同样缺这些段；
- 未联系作者，未公开。

## 时间线

- 2026-10-25 发现/验证；
- 计划 90 天协调窗口；联系渠道为 GitHub 仓库 Security Advisory/issue。
