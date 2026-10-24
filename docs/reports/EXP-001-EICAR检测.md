# 实验报告：EXP-001 EICAR 检测与快照回滚

## 文档控制

| 项 | 值 |
|---|---|
| 编号 | EXP-001 |
| 日期 | 2026-10-24 |
| 执行 | lead（AI） |
| 分类 | 检测 / 隔离 |
| 风险级别 | 低 |
| 状态 | 完成 |

## 1. 目标

验证 lab-win 内 Defender 实时防护能识别 EICAR，且快照回滚可用。

## 2. 范围与环境

- lab-win：Windows 11 Enterprise LTSC Evaluation，Build 26100；
- VirtualBox 7.2.4，Internal Network labnet，Guest Additions 7.2.4；
- 快照：baseline-win11（后重建为 baseline-clean）。

## 3. 假设

- H1：写入 EICAR 后 20 秒内 Defender 记录告警。
- H2：恢复快照后系统可正常启动。

## 4. 步骤

1. 安装 Guest Additions，确认 guestcontrol 可用；
2. 将 stage0.ps1 拷入 C:\lab 并执行；
3. 写入 EICAR 字符串，等待 20 秒；
4. 查询 Get-MpThreatDetection 与 Get-MpComputerStatus；
5. 关机、打快照、恢复、重启，测试 guestcontrol。

## 5. 结果

| 检查项 | 预期 | 实际 | 结论 |
|---|---|---|---|
| 文件存在 | true | true | 未自动删除 |
| 告警记录 | 有 | ThreatID 2147519003，资源 file:_C:\lab\eicar.com | 通过 |
| 实时防护 | True | True | 通过 |
| 回滚后启动 | 可控制 | guestcontrol-ok | 通过 |

## 6. 证据

- 命令输出：stage0 脚本 stdout（file_exists=True、ThreatID 2147519003、RealTimeProtectionEnabled=True）；
- 文件：`data/security/experiments/EXP-001/record.md`；
- 快照：baseline-clean UUID 598aefbc-d8f1-4c42-a4dc-31202054cbd8。

## 7. 分析

事实：Defender 记录了 EICAR，文件仍在。推断：检测不等于清除，处置动作要看 remediation 状态。

## 8. 风险与影响

真实恶意样本若只被检测未被清除，仍可能在系统里运行；不能把“有告警”当成“已清除”。

## 9. 修复与后续

- 立即动作：测试后恢复快照；
- 长期动作：实验报告固定写“检测/清除”两栏；
- 未解决：真实样本的清除动作未测。

## 10. 结论

通过：检测链路和回滚链路都有效。
