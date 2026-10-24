# 实验报告：LAB-DET-016 正常流量误报测试

## 文档控制

| 项 | 值 |
|---|---|
| 编号 | LAB-DET-016 |
| 日期 | 2026-10-24 |
| 执行 | lead（AI） |
| 分类 | 检测工程 / 误报评估 |
| 风险级别 | 低 |
| 状态 | 完成 |

## 1. 目标

用 DVWA 正常业务请求的访问日志测 SQLi/XSS 规则，确认不误报。

## 2. 范围与环境

- lab-win 发 20 条正常请求（首页、登录、about、instructions、正常 id=1/2 查询、name=Alice/Bob、include.php、ip=127.0.0.1 等）；
- 从 dvwa 容器导出最近 30 条访问日志：data/security/detections/benign-dvwa.log；
- 跑 detect_web_sqli.mjs、detect_web_xss.mjs。

## 3. 假设

H1：正常请求不命中 SQLi/XSS 规则。

## 4. 步骤

1. PowerShell 请求 20 个正常 URL；
2. docker logs 导出 30 条访问日志；
3. 跑两条规则，统计命中。

## 5. 结果

| 规则 | 命中 | 样本 |
|---|---|---|
| SQLi | 0 | total=30 |
| XSS | 0 | total=30 |

## 6. 证据

- 证据文件：data/security/experiments/LAB-DET-016/evidence.txt；
- 日志：data/security/detections/benign-dvwa.log（30 行）；
- 脚本：detect_web_sqli.mjs、detect_web_xss.mjs。

## 7. 分析

事实：30 条正常请求 0 命中。推断：当前规则对常规 DVWA 页面误报低；样本只覆盖 20 个 URL，不能代表全部业务。

## 8. 风险与影响

误报低但漏报仍需另测；正常参数里若出现类似 payload 的关键词会命中。

## 9. 修复与后续

- 扩大正常流量样本；
- 对 name 参数做编码变体测试；
- 未解决：未做长期基线。

## 10. 结论

通过：正常流量 30 条，SQLi/XSS 规则 0 命中。
