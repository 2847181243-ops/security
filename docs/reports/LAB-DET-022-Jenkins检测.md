# 实验报告：LAB-DET-022 Jenkins CLI @ 参数检测

## 文档控制

| 项 | 值 |
|---|---|
| 编号 | LAB-DET-022 |
| 日期 | 2026-10-24 |
| 执行 | lead（AI） |
| 分类 | 防守 / 检测工程 |
| 风险级别 | 低 |
| 状态 | 完成（合成日志） |

## 1. 目标

为 CVE-2024-23897 的 CLI @ 文件参数写检测规则，验证正常 CLI 请求不误报。

## 2. 范围与环境

- 规则：docs/security/detections/jenkins-cli-at.yml；
- 脚本：runtime/security/detect_jenkins_cli.mjs；
- 样本：2 行访问日志（普通 help、带 @ 参数的 help）；
- 未接真实 Jenkins 日志。

## 3. 假设

H1：/cli + @ 命中；H2：普通 help 不命中。

## 4. 步骤

1. 规则匹配 cs-uri-stem 以 /cli 结尾且 query 含 @；
2. 构造 2 行日志；
3. 跑等价逻辑。

## 5. 结果

| 行 | 结果 |
|---|---|
| 普通 help | ok |
| help + arg=@... | ALERT |

hits=1 total=2。

## 6. 证据

- 证据文件：data/security/experiments/LAB-DET-022/evidence.txt（含 sigma_validate files=17 ok=17）；
- 规则：docs/security/detections/jenkins-cli-at.yml；
- 脚本：runtime/security/detect_jenkins_cli.mjs。

## 7. 分析

事实：@ 参数命中，普通 CLI 请求不命中；pySigma 解析 17/17。推断：合法 @args 文件会误报，需要白名单。

## 8. 风险与影响

Jenkins CLI 可能走 remoting/其他路径，规则覆盖不全。

## 9. 修复与后续

- 在真实 Jenkins 日志验证；
- 加 remoting 端点；
- 未解决：未接引擎。

## 10. 结论

通过：Jenkins CLI @ 参数规则在合成日志上命中。
