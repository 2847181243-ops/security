# 实验报告：LAB-DET-001 Web SQLi 检测规则

## 文档控制

| 项 | 值 |
|---|---|
| 编号 | LAB-DET-001 |
| 日期 | 2026-10-24 |
| 执行 | lead（AI） |
| 分类 | 防守 / 检测工程 |
| 风险级别 | 低 |
| 状态 | 完成（合成日志验证） |

## 1. 目标

为本地靶场的 SQL 注入请求写一条检测规则，并在正常/恶意混合日志上验证误报与命中。

## 2. 范围与环境

- Sigma 规则：docs/security/detections/sql-injection-web.yml；
- 测试脚本：runtime/security/detect_web_sqli.mjs；
- 日志样本：data/security/detections/sample-web.log（3 行，按实际请求重建，非线上采集）。

## 3. 假设

H1：规则命中注入行；H2：不命中正常 id=1 和含 SQL 关键词的搜索。

## 4. 步骤

1. 写 Sigma 规则（cs-uri-query 含 %27%20OR%20、UNION%20SELECT 等）；
2. 构造 3 行访问日志：正常查询、注入 payload、正常搜索；
3. 用脚本按等价正则匹配，统计命中。

## 5. 结果

| 行 | 内容 | 结果 |
|---|---|---|
| 1 | id=1&Submit=Submit | ok |
| 2 | id=1%27%20OR%20%271%27%3D%271 | ALERT |
| 3 | q=sql%20server%20tutorial | ok |

命中 1/3，符合预期。

## 6. 证据

- 规则文件、测试脚本、sample-web.log；
- 输出：hits=1 total=3。

## 7. 分析

事实：规则能区分编码注入和普通查询。推断：真实 Apache 日志需要在 DVWA 容器里采集，当前样本是按实际请求重建的，不代表线上验证。

## 8. 风险与影响

规则基于关键字，绕过编码或注释会漏报；合法扫描会误报。

## 9. 修复与后续

- 从 docker logs / Apache access.log 采真实日志再跑；
- 增加解码后匹配、UNION/注释变体；
- 未解决：Sigma 引擎未实际执行。

## 10. 结论

完成（合成日志验证）；线上采集待做。
