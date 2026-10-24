# 实验报告：LAB-DET-012 EICAR 文本扩展名检测

## 文档控制

| 项 | 值 |
|---|---|
| 编号 | LAB-DET-012 |
| 日期 | 2026-10-24 |
| 执行 | lead（AI） |
| 分类 | 检测 / Defender |
| 风险级别 | 低 |
| 状态 | 完成 |

## 1. 目标

验证 Defender 是否只按扩展名检测：把 EICAR 写成 .txt，看是否仍告警。

## 2. 范围与环境

- lab-win，Windows 11 LTSC，Defender 实时防护开启；
- 文件：C:\lab\eicar-test.txt，内容由字符码在 guest 内生成，宿主不落地；
- 只写无害测试串，不执行。

## 3. 假设

H1：Defender 仍识别；H2：文件可能不被自动删除。

## 4. 步骤

1. 在 guest 内用字符码拼出 EICAR；
2. 写 C:\lab\eicar-test.txt；
3. 等 15 秒，查文件是否存在、Get-MpThreatDetection。

## 5. 结果

| 检查项 | 预期 | 实际 | 结论 |
|---|---|---|---|
| 文件存在 | 可能 | FILE_EXISTS=True | 记录 |
| 告警 | 有 | ThreatID 2147519003，资源 eicar-test.txt | 通过 |
| 自动删除 | 未知 | 未删除 | 记录 |

## 6. 证据

- 证据文件：data/security/experiments/LAB-DET-012/evidence.txt；
- 输出：FILE_EXISTS=True；ThreatID 2147519003；Resources=file:_C:\lab\eicar-test.txt。

## 7. 分析

事实：.txt 扩展名仍被 Defender 识别，文件留在原地。推断：该签名不依赖扩展名；检测不等于清除。

## 8. 风险与影响

把“改了扩展名”当免杀手段不成立；但真实恶意样本是否被清除要另看。

## 9. 修复与后续

- 对真实样本测 remediation 动作；
- 未解决：未测压缩包/加密容器内的 EICAR。

## 10. 结论

通过：Defender 对 .txt 中的 EICAR 仍告警，文件未被自动删除。
