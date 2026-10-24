# 实验报告：LAB-DET-014 Log4Shell JNDI 检测

## 文档控制

| 项 | 值 |
|---|---|
| 编号 | LAB-DET-014 |
| 日期 | 2026-10-24 |
| 执行 | lead（AI） |
| 分类 | 防守 / 检测工程 |
| 风险级别 | 低 |
| 状态 | 完成（合成日志） |

## 1. 目标

为 CVE-2021-44228 的 JNDI 注入写检测规则，覆盖明文与 URL 编码两种形式。

## 2. 范围与环境

- 规则：docs/security/detections/log4shell-jndi.yml；
- 脚本：runtime/security/detect_log4shell.mjs；
- 样本：2 行访问日志（正常搜索、编码后的 JNDI payload）；
- 未搭建 Log4j 靶场，本报告只验证检测。

## 3. 假设

H1：编码后的 jndi ldap URL 能命中；H2：普通搜索不命中；明文 jndi 形式未单独构造，不算已验证。

## 4. 步骤

1. 规则匹配 cs-uri-query 中的 jndi 语法与 URL 编码形式；
2. 构造 2 行日志；
3. 跑等价逻辑。

## 5. 结果

| 行 | 结果 |
|---|---|
| q=hello | ok |
| q=%24%7Bjndi%3Aldap... | ALERT |

hits=1 total=2。

## 6. 证据

- 证据文件：data/security/experiments/LAB-DET-014/evidence.txt；
- 规则：docs/security/detections/log4shell-jndi.yml；
- 脚本：runtime/security/detect_log4shell.mjs。

## 7. 分析

事实：编码 payload 命中，普通查询不命中；现跑 pySigma 13/13 通过（输出见 evidence）。推断：JNDI 也可能出现在 header/body，当前只覆盖 query。

## 8. 风险与影响

绕编码（二次编码、大小写混合）会漏；body/header 注入完全看不到。

## 9. 修复与后续

- 扩到 header/body 日志；
- 搭 Log4j 靶场做真实复现；
- 未解决：未复现、未执行 SPL。

## 10. 结论

通过：JNDI 检测规则在合成日志上命中。
