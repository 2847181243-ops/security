# 实验报告：LAB-DET-023 Citrix Bleed 探测检测

## 文档控制

| 项 | 值 |
|---|---|
| 编号 | LAB-DET-023 |
| 日期 | 2026-10-24 |
| 执行 | lead（AI） |
| 分类 | 防守 / 网络检测 |
| 风险级别 | 低 |
| 状态 | 完成（合成载荷） |

## 1. 目标

为 CVE-2023-4966 写 Suricata 规则，匹配 Citrix Bleed 的探测 URI。

## 2. 范围与环境

- 规则：rules/suricata/citrix-bleed.rules；
- 脚本：runtime/security/test_citrix.mjs（等价内容匹配）；
- 样本：2 行请求（普通 /、Citrix OIDC 探测路径）；
- 未运行 Suricata 引擎。

## 3. 假设

H1：命中 OIDC 探测路径；H2：普通请求不命中。

## 4. 步骤

1. 写规则，content 为 Citrix OIDC 探测路径；
2. 构造 2 行样本；
3. 用等价匹配统计。

## 5. 结果

| 行 | 结果 |
|---|---|
| GET / | ok |
| GET /oauth/idp/.well-known/openid-configuration | ALERT |

hits=1 total=2。

## 6. 证据

- 证据文件：data/security/experiments/LAB-DET-023/evidence.txt；
- 规则：rules/suricata/citrix-bleed.rules；
- 脚本：runtime/security/test_citrix.mjs。

## 7. 分析

事实：探测 URI 可区分两份样本。推断：正常 Citrix 登录也会访问该路径，误报取决于上下文；需要结合 Host/大量请求。

## 8. 风险与影响

只匹配 URI，正常 OIDC 流量会误报。

## 9. 修复与后续

- 加 Citrix 资产管理/白名单；
- 结合响应长度异常；
- 未解决：未跑引擎、未复现。

## 10. 结论

通过：Citrix Bleed 探测规则在合成载荷上命中。
