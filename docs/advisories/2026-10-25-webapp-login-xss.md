# Advisory：lab webapp /login 反射 XSS

## 基本信息

- 产品：lab/webapp（自建训练靶场，非第三方产品）
- 版本：本地源码，无版本号
- 发现者：lead（AI）
- 日期：2026-10-25
- 渠道：内部记录；不申请 CVE（自建代码）

## 影响

- 类型：反射型 XSS
- 前置：受害者点击带 payload 的 /login 链接
- 影响：在应用源执行脚本，可窃取会话/发起操作
- 最小 PoC：/login?user=<img src=x onerror=alert(1)>&pass=x，响应 <pre> 内原样包含标签

## 修复

- 已在 server.mjs 加 esc()，/login 两处回显做 HTML 转义；
- 回归：payload 变为 &lt;img...&gt;，正常 alice 登录仍 200；
- 报告：LAB-AUDIT-008。

## 时间线

- T0 2026-10-25 发现并修复；
- 自建靶场无外部厂商，不走 CVD/CVE；
- 保留记录用于流程演练。

## 约束

- 不公开可直接利用的完整 exploit；
- 只在 127.0.0.1 验证。
