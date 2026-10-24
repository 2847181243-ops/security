# 实验报告：LAB-DET-009 Sigma 规则语法验收

## 文档控制

| 项 | 值 |
|---|---|
| 编号 | LAB-DET-009 |
| 日期 | 2026-10-24 |
| 执行 | lead（AI） |
| 分类 | 检测工程 / 规则验收 |
| 风险级别 | 低 |
| 状态 | 完成 |

## 1. 目标

用 pySigma 解析全部 Sigma 规则，确认语法有效、id 合法。

## 2. 范围与环境

- pySigma（pip 安装）与解析脚本 runtime/security/sigma_validate.py；
- 目标：docs/security/detections/*.yml，共 10 条规则；
- 只解析，不执行后端查询。

## 3. 假设

H1：规则能被 SigmaCollection 解析；H2：id 必须是 UUID。

## 4. 步骤

1. 写脚本 glob 全部 yml，调用 SigmaCollection.from_yaml；
2. 输出每条规则的 id 与数量；
3. 失败则退出非零。

## 5. 结果

| 检查项 | 预期 | 实际 | 结论 |
|---|---|---|---|
| 解析 | 10 条通过 | files=10 ok=10 bad=0 | 通过 |
| id | UUID | 10 个 UUID | 通过 |

## 6. 证据

- 证据文件：data/security/experiments/LAB-DET-009/evidence.txt；
- 脚本：runtime/security/sigma_validate.py。

## 7. 分析

事实：10 条规则均被 pySigma 解析。推断：语法层可用，但后端查询语义/误报仍需真实数据验证；之前 id 非 UUID，解析会失败，已统一改成 UUID。

## 8. 风险与影响

解析通过不等于检测有效；规则条件、字段名仍可能不匹配真实日志。

## 9. 修复与后续

- 接 Sigma 后端（如 Splunk/Elastic）生成查询；
- 用真实事件验证字段；
- 未解决：未执行后端查询。

## 10. 结论

通过：10 条 Sigma 规则语法与 id 全部合法。
