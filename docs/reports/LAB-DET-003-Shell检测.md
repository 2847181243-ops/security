# 实验报告：LAB-DET-003 Web 进程拉起 shell 检测

## 文档控制

| 项 | 值 |
|---|---|
| 编号 | LAB-DET-003 |
| 日期 | 2026-10-24 |
| 执行 | lead（AI） |
| 分类 | 防守 / 检测工程 |
| 风险级别 | 低 |
| 状态 | 完成（合成事件验证） |

## 1. 目标

检测 Web 服务器进程拉起 shell 的命令注入行为。

## 2. 范围与环境

- Sigma 规则：docs/security/detections/web-shell-spawn.yml；
- 测试脚本：runtime/security/detect_web_shell.mjs；
- 样本：3 条合成进程事件（正常 apache、apache→sh、cron→sh）。

## 3. 假设

H1：命中 apache→sh；H2：不命中正常 apache 和 cron→sh。

## 4. 步骤

1. 写规则：ParentImage 以 apache2/httpd/nginx 结尾，Image 以 sh/bash/dash 结尾；
2. 构造 3 条事件；
3. 用等价逻辑匹配。

## 5. 结果

| 事件 | 结果 |
|---|---|
| apache→apache | ok |
| apache→sh（含 ;id） | ALERT |
| cron→sh | ok |

命中 1/3。

## 6. 证据

- 规则、脚本、sample-process.json；
- 输出 hits=1 total=3。

## 7. 分析

规则依赖父子进程关系，比关键字稳；但 CGI 场景可能误报，需要基线白名单。

## 8. 风险与影响

漏报：注入后不拉 shell 的情况；误报：正常 CGI。

## 9. 修复与后续

- 接入 auditd/EDR 事件验证；
- 加命令行特征（;id、|whoami）做二次确认；
- 未解决：未接真实进程日志。

## 10. 结论

完成（合成事件验证）。
