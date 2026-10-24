# 实验报告：LAB-AUDIT-002 本地项目静态审计

## 文档控制

| 项 | 值 |
|---|---|
| 编号 | LAB-AUDIT-002 |
| 日期 | 2026-10-24 |
| 执行 | lead（AI） |
| 分类 | 静态审计 |
| 风险级别 | 中 |
| 状态 | 完成 |

## 1. 目标

用 Semgrep OWASP 规则扫本地项目 D:\bloodborne-seamless-coop，逐条判断命中是否真实风险。

## 2. 范围与环境

- Semgrep 1.182.1，规则 p/owasp-top-ten，300 个文件（规则数未在 JSON 记录）；
- 只读扫描，未改项目代码。

## 3. 假设

H1：能找到供应链/命令执行类问题；H2：命中需要人工复核，不能直接当漏洞。

## 4. 步骤

1. semgrep scan --config p/owasp-top-ten 扫项目，输出 JSON；
2. 按 rule id、路径、行号汇总；
3. 读命中上下文，判断可利用性。

## 5. 结果

共 15 条命中：

| 类别 | 数量 | 位置 | 判断 |
|---|---|---|---|
| GitHub Actions 使用可变 tag | 13 | .github/workflows/*.yml | 供应链风险，建议 pin SHA |
| subprocess 使用环境变量参数 | 2 | tools/preci/check_ruleset_drift.py:94、fetch_pr.py:88 | 低风险：列表传参、无 shell；IP 来自 BBCOOP_GH_IP，建议校验 |

## 6. 证据

- JSON：data/security/semgrep-bloodborne.json（另有 12 条解析/告警未列入本报告表）；
- 代码上下文：check_ruleset_drift.py 80-106、fetch_pr.py 78-94。

## 7. 分析

事实：7 个 workflow 文件里共 13 处用 tag/branch 引用 action；2 个 subprocess.run 用列表参数。推断：subprocess 命中是 Semgrep 对 tainted env 的保守规则，实际无 shell 注入；可变 tag 是真实供应链风险，但需要仓库写权限才能利用。

## 8. 风险与影响

可变 tag 若被上游 action 仓库劫持，CI 可能执行恶意代码；subprocess 的 env IP 只影响请求目标，不构成命令执行。

## 9. 修复与后续

- 把 13 处 action 引用改成 commit SHA（可用 pin-github-action 工具）；
- 对 BBCOOP_GH_IP 做 IP 格式校验；
- 未解决：未做动态验证，未改代码。

## 10. 结论

完成：15 条命中已分级，13 条供应链建议、2 条低风险误报。
