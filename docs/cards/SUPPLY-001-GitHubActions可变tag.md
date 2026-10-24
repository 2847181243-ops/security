# SUPPLY-001 GitHub Actions 使用可变 tag

- 对象：本地项目 .github/workflows/*.yml（非第三方生产系统）
- 类型：供应链 / CI 配置
- 证据：Semgrep OWASP 扫描命中 13 处，示例 .github/workflows/branch-policy.yml:31、build.yml:38、pr-guard.yml:376
- 影响：上游 action 仓库的 tag 被改写时，CI 可能执行未审计代码；需要攻击者先控制上游仓库
- 修复：把 action 引用 pin 到 commit SHA，启用 Dependabot 更新
- 置信度：配置事实高；实际利用条件未验证
- 备注：只读扫描，未改项目；报告 LAB-AUDIT-002
