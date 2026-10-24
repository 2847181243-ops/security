# 实验报告：LAB-AUDIT-003 DSH 组件静态审计

## 文档控制

| 项 | 值 |
|---|---|
| 编号 | LAB-AUDIT-003 |
| 日期 | 2026-10-24 |
| 执行 | lead（AI） |
| 分类 | 静态审计 |
| 风险级别 | 低 |
| 状态 | 完成（0 命中） |

## 1. 目标

对本地 DSH 安装中的安全相关包做静态扫描，建立第三方组件审计基线。

## 2. 范围与环境

- 目标：@deepseek-ai 下 dsh-api-gateway、dsh-api-workspace-files、dsh-client-file-upload、dsh-authorization、dsh-web-frontend、dsh-host-webserver、dsh-tool-web；
- Semgrep 1.182.1，规则 p/owasp-top-ten 与 auto；
- 只读扫描，未改安装目录。

## 3. 假设

H1：能找到路径/上传/鉴权类问题；H2：打包代码可能无法被规则解析。

## 4. 步骤

1. 扫 4 个安全相关包（OWASP Top Ten），输出 semgrep-dsh.json；
2. 扫 3 个 Web 包（OWASP Top Ten），输出 semgrep-dsh-web.json；
3. 对 dsh-web-frontend 跑 auto 规则，输出 semgrep-dsh-auto.json。

## 5. 结果

| 扫描 | 规则 | 文件 | 命中 |
|---|---|---|---|
| 安全包 | OWASP | 4 包 | 0 |
| Web 包 | OWASP | 3 包 | 0 |
| 前端 | auto | dsh-web-frontend | 0 |

## 6. 证据

- data/security/semgrep-dsh.json、semgrep-dsh-web.json、semgrep-dsh-auto.json；
- 均为 0 results。

## 7. 分析

事实：规则在这些包上没有命中。推断：前端是打包/压缩代码，规则解析覆盖有限；0 命中不能说明没有问题。

## 8. 风险与影响

把 0 命中当安全结论会误导；需要动态测试和人工审计补充。

## 9. 修复与后续

- 对关键控制器做人工代码审计；
- 用动态请求测试鉴权/路径处理；
- 未解决：未覆盖全部 307 个包。

## 10. 结论

完成：基线 0 命中，覆盖有限。
