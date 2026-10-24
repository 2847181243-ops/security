# 实验报告：LAB-DET-007 LOLBin 下载/脚本执行检测

## 文档控制

| 项 | 值 |
|---|---|
| 编号 | LAB-DET-007 |
| 日期 | 2026-10-24 |
| 执行 | lead（AI） |
| 分类 | 防守 / 检测工程 |
| 风险级别 | 低 |
| 状态 | 完成（合成事件） |

## 1. 目标

为 certutil、rundll32、mshta 的下载/脚本执行行为写 Sigma 规则并验证。

## 2. 范围与环境

- 规则：docs/security/detections/lolbin-download.yml；
- 测试脚本：runtime/security/detect_lolbin.mjs；
- 事件：6 条合成进程事件（3 恶意、3 正常）。

## 3. 假设

H1：certutil 带 urlcache/http、rundll32 带 javascript:、mshta 带 http 命中；H2：正常参数不命中。

## 4. 步骤

1. 写规则，按进程名 + 命令行特征匹配；
2. 构造 6 条事件；
3. 用等价逻辑统计。

## 5. 结果

| 事件 | 结果 |
|---|---|
| certutil -urlcache -split -f http | ALERT |
| certutil -store My | ok |
| rundll32 javascript: | ALERT |
| rundll32 shell32.dll | ok |
| mshta http | ALERT |
| notepad | ok |

hits=3 total=6。

## 6. 证据

- 证据文件：data/security/experiments/LAB-DET-007/evidence.txt；
- 规则：docs/security/detections/lolbin-download.yml；
- 脚本：runtime/security/detect_lolbin.mjs。

## 7. 分析

事实：三条规则在合成事件上命中预期行为。推断：真实环境需放行内部 HTTPS 下载和合法 mshta 应用，否则误报。

## 8. 风险与影响

规则只看命令行，编码/别名参数可绕过；需要结合父进程与网络事件。

## 9. 修复与后续

- 接 Sysmon 事件 1/3 验证；
- 加父进程白名单；
- 未解决：Sigma 引擎未执行，只跑等价逻辑。

## 10. 结论

通过：LOLBin 检测规则行为符合预期。
