# 实验报告：LAB-AUDIT-007 Windows 靶场安全基线

## 文档控制

| 项 | 值 |
|---|---|
| 编号 | LAB-AUDIT-007 |
| 日期 | 2026-10-25 |
| 执行 | lead（AI） |
| 分类 | 配置审计 |
| 风险级别 | 低 |
| 状态 | 完成 |

## 1. 目标

检查 lab-win 的 Defender、防火墙、SMB1、UAC 和内置账号状态。

## 2. 范围与环境

- lab-win，Windows 11 LTSC；
- 只读 PowerShell 检查，不改配置。

## 3. 假设

H1：Defender/防火墙开启；H2：SMB1 关闭、内置账号禁用。

## 4. 步骤

1. Get-MpComputerStatus；
2. Get-NetFirewallProfile；
3. Get-SmbServerConfiguration；
4. 注册表 UAC、Get-LocalUser。

## 5. 结果

| 检查项 | 实际 | 结论 |
|---|---|---|
| Defender AV/RTP | True/True | 通过 |
| 防火墙 | Domain/Private/Public 全 True | 通过 |
| SMB1 | False（SMB2 True） | 通过 |
| UAC | EnableLUA=1，ConsentPrompt=5 | 通过 |
| 内置账号 | Administrator/Guest 均 False | 通过 |

## 6. 证据

- 证据文件：data/security/experiments/LAB-AUDIT-007/evidence.txt。

## 7. 分析

事实：基线项均符合预期；AMSIProviderVersion 为空，可能是属性缺失而非关闭。推断：靶场默认防护可用，但 EICAR 测试已证明检测不等于清除。

## 8. 风险与影响

关闭 Defender 或开 SMB1 会扩大攻击面；当前未关闭。

## 9. 修复与后续

- 定期复查；
- 不给 lab 用户管理员权限；
- 未解决：未测 ASR 规则。

## 10. 结论

通过：Windows 靶场基线项均正常。
