# 实验报告：LAB-DET-018 Tomcat PUT JSP 检测

## 文档控制

| 项 | 值 |
|---|---|
| 编号 | LAB-DET-018 |
| 日期 | 2026-10-24 |
| 执行 | lead（AI） |
| 分类 | 防守 / 检测工程 |
| 风险级别 | 低 |
| 状态 | 完成（合成日志） |

## 1. 目标

为 CVE-2017-12615 类 PUT 写 JSP 的行为写检测规则，验证普通上传不误报。

## 2. 范围与环境

- 规则：docs/security/detections/tomcat-put-jsp.yml；
- 脚本：runtime/security/detect_tomcat_put.mjs；
- 样本：3 行访问日志（PUT /1.jsp/、GET /1.jsp、PUT /readme.txt）。

## 3. 假设

H1：PUT + .jsp 命中；H2：GET 和普通 PUT 不命中。

## 4. 步骤

1. 规则匹配 cs-method=PUT 且 cs-uri-stem 以 .jsp 结尾；
2. 构造 3 行日志；
3. 跑等价逻辑。

## 5. 结果

| 行 | 结果 |
|---|---|
| PUT /1.jsp/ | ALERT |
| GET /1.jsp | ok |
| PUT /readme.txt | ok |

hits=1 total=3。

## 6. 证据

- 证据文件：data/security/experiments/LAB-DET-018/evidence.txt；
- 规则：docs/security/detections/tomcat-put-jsp.yml；
- 脚本：runtime/security/detect_tomcat_put.mjs。

## 7. 分析

事实：PUT JSP 命中，普通 GET/PUT 不命中；pySigma 解析 16/16。推断：合法 WebDAV 上传 .jsp 的场景会误报，需要白名单。

## 8. 风险与影响

只覆盖 PUT 方法；分块上传/其他后缀变形可能漏。

## 9. 修复与后续

- 加 WebDAV 白名单；
- 与文件落地事件关联；
- 未解决：未在真实日志验证。

## 10. 结论

通过：PUT 写 JSP 规则在合成日志上命中。
