# 实验报告：LAB-DET-006 启动项与计划任务检测

## 文档控制

| 项 | 值 |
|---|---|
| 编号 | LAB-DET-006 |
| 日期 | 2026-10-24 |
| 执行 | lead（AI） |
| 分类 | 防守 / 检测工程 |
| 风险级别 | 低 |
| 状态 | 完成（合成事件） |

## 1. 目标

为 EXP-002/004 验证过的启动项与计划任务行为写 Sigma 规则，并用合成事件验证。

## 2. 范围与环境

- 规则：docs/security/detections/run-key-persistence.yml、scheduled-task-creation.yml；
- 测试脚本：runtime/security/detect_persistence.mjs；
- 事件：6 条合成事件（2 条 Run/RunOnce、1 条普通注册表、1 条 schtasks /create、1 条 query、1 条 notepad）。

## 3. 假设

H1：Run/RunOnce 写入命中；H2：schtasks /create 命中，query 不命中。

## 4. 步骤

1. 写两条 Sigma 规则；
2. 构造 6 条事件；
3. 用等价逻辑匹配并统计。

## 5. 结果

| 事件 | 结果 |
|---|---|
| Run\FakeUpdater | REG_ALERT |
| RunOnce\Setup | REG_ALERT |
| 普通注册表设置 | ok |
| schtasks /create | TASK_ALERT |
| schtasks /query | ok |
| notepad | ok |

reg_hits=2、task_hits=1、total=6。

## 6. 证据

- 证据文件：data/security/experiments/LAB-DET-006/evidence.txt；
- 规则文件：docs/security/detections/run-key-persistence.yml、scheduled-task-creation.yml；
- 脚本：runtime/security/detect_persistence.mjs。

## 7. 分析

事实：两条规则在合成事件上命中预期行为，未误报 query/notepad。推断：真实环境要按进程父级和用户上下文降噪，安装程序会写 Run 键。

## 8. 风险与影响

规则只覆盖命令行和注册表路径，改注册表 API 或计划任务 COM 创建可能漏。

## 9. 修复与后续

- 接 Sysmon/auditd 真实事件；
- 给 Run 键规则加签名/路径白名单；
- 未解决：Sigma 引擎未执行，只跑等价逻辑。

## 10. 结论

通过：两条持久化检测规则行为符合预期。
