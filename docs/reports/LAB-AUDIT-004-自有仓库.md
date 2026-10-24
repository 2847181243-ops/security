# 实验报告：LAB-AUDIT-004 自有仓库静态审计

## 文档控制

| 项 | 值 |
|---|---|
| 编号 | LAB-AUDIT-004 |
| 日期 | 2026-10-24 |
| 执行 | lead（AI） |
| 分类 | 静态审计 |
| 风险级别 | 低 |
| 状态 | 完成 |

## 1. 目标

用 Semgrep OWASP 规则扫自己的 security-lab-notes 仓库，找供应链/注入类问题。

## 2. 范围与环境

- Semgrep 1.182.1，规则 p/owasp-top-ten；
- 目标：repos/security-lab-notes，103 个文件；
- 只读扫描。

## 3. 假设

H1：仓库小，可能有 GitHub Actions 可变 tag；H2：无运行时代码注入。

## 4. 步骤

1. semgrep scan --config p/owasp-top-ten --json；
2. 读命中；
3. 把 action 固定到 40 位 commit SHA；
4. 重扫。

## 5. 结果

| 阶段 | 命中 | 说明 |
|---|---|---|
| 修复前 | 2 | actions/checkout@v4、actions/setup-node@v4 可变 tag |
| 修复后 | 0 | 已 pin 到 commit SHA |

扫描文件 103，errors=0。

## 6. 证据

- 证据文件：data/security/experiments/LAB-AUDIT-004/evidence.txt；
- JSON：data/security/semgrep-lab-notes.json（修复后扫描，results=0；修复前 2 条命中见 evidence.txt）；
- 密钥扫描：gitleaks 8.28.0，仓库 167,588 字节、docs/security 148,788 字节、runtime/security 88,241 字节，均 no leaks found；
- 修复：.github/workflows/validate.yml 两个 uses 改为 40 位 SHA。

## 7. 分析

事实：唯一命中是 CI action 可变 tag，属于供应链风险；改成 SHA 后 0 命中。推断：Semgrep OWASP 规则不覆盖 shell 脚本逻辑，仍需人工看。

## 8. 风险与影响

可变 tag 被上游重指可能执行恶意 CI 代码；pin SHA 降低但不能防仓库被接管。

## 9. 修复与后续

- 定期更新 SHA 并记录版本注释；
- 加 secret 扫描；
- 未解决：未做依赖漏洞扫描。

## 10. 结论

通过：2 个可变 tag 已修复，重扫 0 命中。
