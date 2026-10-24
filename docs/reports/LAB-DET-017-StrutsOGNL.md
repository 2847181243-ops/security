# 实验报告：LAB-DET-017 Struts OGNL 检测

## 文档控制

| 项 | 值 |
|---|---|
| 编号 | LAB-DET-017 |
| 日期 | 2026-10-24 |
| 执行 | lead（AI） |
| 分类 | 防守 / 检测工程 |
| 风险级别 | 低 |
| 状态 | 完成（合成日志） |

## 1. 目标

为 Apache Struts OGNL 注入（含 CVE-2016-3081 类）写检测规则，验证正常请求不误报。

## 2. 范围与环境

- 规则：docs/security/detections/struts-ognl.yml；
- 脚本：runtime/security/detect_struts.mjs；
- 样本：2 行访问日志（正常 name=Bob、OGNL 编码 payload）；
- 未搭 Struts 靶场，本报告只验证检测。

## 3. 假设

H1：含 #_memberAccess/ognl.OgnlContext 的请求命中；H2：正常参数不命中。

## 4. 步骤

1. 规则匹配 cs-uri-query 中的 OGNL 标记与编码形式；
2. 构造 2 行日志；
3. 跑等价逻辑。

## 5. 结果

| 行 | 结果 |
|---|---|
| name=Bob | ok |
| name=%25%7B%23_memberAccess... | ALERT |

hits=1 total=2。

## 6. 证据

- 证据文件：data/security/experiments/LAB-DET-017/evidence.txt；
- 规则：docs/security/detections/struts-ognl.yml；
- 脚本：runtime/security/detect_struts.mjs。

## 7. 分析

事实：编码 payload 命中，正常请求不命中；pySigma 解析 15/15。推断：Struts2 的 payload 变体很多，单靠标记会漏；需要结合路径与响应。

## 8. 风险与影响

只覆盖 query，POST body 与 header 注入看不到；编码变形会漏。

## 9. 修复与后续

- 扩到 body/header；
- 搭 Struts2 靶场验证真实 payload；
- 未解决：未复现、未接后端。

## 10. 结论

通过：Struts OGNL 规则在合成日志上命中。
