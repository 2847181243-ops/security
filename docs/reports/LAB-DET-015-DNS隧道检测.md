# 实验报告：LAB-DET-015 DNS 隧道检测

## 文档控制

| 项 | 值 |
|---|---|
| 编号 | LAB-DET-015 |
| 日期 | 2026-10-24 |
| 执行 | lead（AI） |
| 分类 | 防守 / 检测工程 |
| 风险级别 | 低 |
| 状态 | 完成（合成日志） |

## 1. 目标

为 T1071.004 DNS 隧道写一个基于长标签/高熵的规则，验证正常域名不误报。

## 2. 范围与环境

- 规则：docs/security/detections/dns-tunneling.yml；
- 脚本：runtime/security/detect_dns_tunnel.mjs；
- 样本：3 条合成 DNS 日志（example.com、www.microsoft.com、48 字符标签）。

## 3. 假设

H1：48 字符编码标签命中；H2：普通域名不命中。

## 4. 步骤

1. 规则匹配 QueryName 首标签长度 ≥40 且为 base64/url 字符集；
2. 构造 3 条日志；
3. 用等价逻辑统计。

## 5. 结果

| 查询 | 结果 |
|---|---|
| example.com | ok |
| www.microsoft.com | ok |
| 48×a.evil.example | ALERT |

hits=1 total=3。

## 6. 证据

- 证据文件：data/security/experiments/LAB-DET-015/evidence.txt；
- 规则：docs/security/detections/dns-tunneling.yml；
- 脚本：runtime/security/detect_dns_tunnel.mjs。

## 7. 分析

事实：长标签命中，普通域名不命中；pySigma 解析 14/14。推断：CDN/遥测域名可能有长标签，需要白名单和频率基线。

## 8. 风险与影响

短标签分片、多域名轮换可以绕过；只看长度会误报。

## 9. 修复与后续

- 加查询频率/熵/陌生域组合；
- 接 DNS 解析日志；
- 未解决：未在真实 DNS 流量上验证。

## 10. 结论

通过：DNS 长标签规则在合成日志上命中，普通域名未误报。
