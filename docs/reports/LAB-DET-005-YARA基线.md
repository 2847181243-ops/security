# 实验报告：LAB-DET-005 YARA 基线

## 文档控制

| 项 | 值 |
|---|---|
| 编号 | LAB-DET-005 |
| 日期 | 2026-10-24 |
| 执行 | lead（AI） |
| 分类 | 检测工程 / 静态规则 |
| 风险级别 | 低 |
| 状态 | 完成（合成样本） |

## 1. 目标

用 YARA 4.5.2 跑自写规则，验证行业规则引擎的命中/未命中行为，并与关键字扫描对比。

## 2. 范围与环境

- Windows 宿主，yara64.exe 4.5.2（GitHub 官方 win64 包）；
- 规则：rules/yara/lab-suspicious.yar（两条低置信度规则）；
- 样本：yara-test.txt（含全部关键字）、yara-suspicious.txt、notepad.exe；
- 只读扫描，不执行样本。

## 3. 假设

H1：含全部关键字的测试文件命中两条规则；H2：普通 PE 不命中。

## 4. 步骤

1. 下载 yara 4.5.2 win64 并解压；
2. 写 Suspicious_PowerShell_Encoded（powershell、-enc、FromBase64String 三者全中）和 Ransomware_Note_Strings（任一命中）；
3. 对三个文件跑 yara64 -s，输出落 evidence.txt。

## 5. 结果

| 文件 | 命中 | 说明 |
|---|---|---|
| yara-test.txt | 2 条 | 字符串偏移 0x0/0xb/0x10/0x21/0x40 |
| yara-suspicious.txt | 0 | 缺 FromBase64String，all-of 不满足 |
| notepad.exe | 0 | 无关键字 |

## 6. 证据

- 证据文件：data/security/experiments/LAB-DET-005/evidence.txt；
- 规则：rules/yara/lab-suspicious.yar；
- 输出：yara-test 命中 Suspicious_PowerShell_Encoded、Ransomware_Note_Strings；其余两文件无输出。

## 7. 分析

事实：YARA 按规则条件命中，测试文件两条全中；缺一个关键字的文件不命中。推断：all-of 规则比关键字扫描严格，误报低但漏报高；规则置信度标 low。

## 8. 风险与影响

关键字规则对变形样本易漏；YARA 只做静态匹配，不替代行为检测。

## 9. 修复与后续

- 给规则加置信度和参考；
- 用真实样本/良性集做误报测试；
- 未解决：未接 YARA 到扫描流水线，未测大文件性能。

## 10. 结论

通过：YARA 基线可用，规则行为符合预期。
