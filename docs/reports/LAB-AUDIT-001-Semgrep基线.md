# 实验报告：LAB-AUDIT-001 Semgrep 基线扫描

## 文档控制

| 项 | 值 |
|---|---|
| 编号 | LAB-AUDIT-001 |
| 日期 | 2026-10-24 |
| 执行 | lead（AI） |
| 分类 | 静态审计 |
| 风险级别 | 低 |
| 状态 | 部分完成 |

## 1. 目标

建立 Semgrep 基线：用 OWASP Top Ten 规则扫自己的仓库与靶场代码，确认工具链可用并记录结果。

## 2. 范围与环境

- 宿主 Windows，Semgrep 1.182.1（Python 3.14 wheel，路径 Scripts\semgrep.exe）；
- 目标：<workspace>/repos、<workspace>/lab/webapp；
- 只读扫描，不执行目标代码。

## 3. 假设

H1：Semgrep 能在本机跑；H2：基线应给出可解释的命中或 0 命中。

## 4. 步骤

1. 用完整路径运行 semgrep --version，确认 1.182.1；
2. semgrep scan --config p/owasp-top-ten --json 扫描两个目录；
3. 自写 taint 规则（XSS/路径穿越）扫 lab/webapp/server.mjs。

## 5. 结果

| 检查项 | 预期 | 实际 | 结论 |
|---|---|---|---|
| 工具可用 | 版本号 | 1.182.1 | 通过 |
| OWASP 规则 | 跑完 | 39 个文件、0 findings（规则数未在 JSON 记录） | 通过 |
| 自写规则 | 命中已知模式 | 0 findings（taint 未穿透包装函数） | 未通过 |

## 6. 证据

- `data/security/semgrep-owasp.json`（完整 JSON）；
- 规则文件 `rules/semgrep/lab-web.yaml`；
- 输出摘要：Rules run 220、Targets 39、Findings 0。

## 7. 分析

事实：OWASP 规则集在本仓库 0 命中。推断：代码量小、模式不匹配，不能据此说“没有漏洞”；自写 taint 规则没覆盖 send() 包装，说明规则需要针对代码结构改写。

## 8. 风险与影响

0 命中容易被误读成安全；必须写明覆盖范围与规则局限。

## 9. 修复与后续

- 规则改为匹配 res.end 直接调用或加 sanitizer 模型；
- 扩大扫描目标到真实项目；
- 未解决：taint 穿透包装函数。

## 10. 结论

通过（工具链与基线）；自写规则待改进。
