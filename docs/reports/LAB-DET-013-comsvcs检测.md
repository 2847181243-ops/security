# 实验报告：LAB-DET-013 comsvcs MiniDump 检测

## 文档控制

| 项 | 值 |
|---|---|
| 编号 | LAB-DET-013 |
| 日期 | 2026-10-24 |
| 执行 | lead（AI） |
| 分类 | 防守 / 检测工程 |
| 风险级别 | 低 |
| 状态 | 完成（合成事件） |

## 1. 目标

为 rundll32 调用 comsvcs.dll MiniDump 的凭据转储行为写规则并验证。

## 2. 范围与环境

- 规则：docs/security/detections/comsvcs-minidump.yml；
- 脚本：runtime/security/detect_comsvcs.mjs；
- 事件：3 条合成命令行。

## 3. 假设

H1：rundll32 + comsvcs.dll + MiniDump 命中；H2：普通 rundll32 与 notepad 不命中。

## 4. 步骤

1. 写规则，匹配 Image 为 rundll32 且命令行含 comsvcs.dll、MiniDump；
2. 构造 3 条事件；
3. 统计命中。

## 5. 结果

| 事件 | 结果 |
|---|---|
| rundll32 comsvcs.dll MiniDump 1234 lsass.dmp | ALERT |
| rundll32 shell32.dll,Control_RunDLL | ok |
| notepad comsvcs.dll MiniDump | ok |

hits=1 total=3。

## 6. 证据

- 证据文件：data/security/experiments/LAB-DET-013/evidence.txt；
- 规则：docs/security/detections/comsvcs-minidump.yml；
- 脚本：runtime/security/detect_comsvcs.mjs。

## 7. 分析

事实：规则命中目标命令行；pySigma 解析通过（当时 11 条，现 13 条，输出见 LAB-DET-009）。推断：真实环境可能有管理员诊断误报，需要白名单。

## 8. 风险与影响

规则只看命令行，改参数顺序仍可绕过；直接 syscall 转储不覆盖。

## 9. 修复与后续

- 结合 LSASS 访问事件关联；
- 加管理员工具白名单；
- 未解决：未在真实事件上验证。

## 10. 结论

通过：comsvcs MiniDump 规则行为符合预期。
