# 实验报告：LAB-DET-004 真实日志检测验证

## 文档控制

| 项 | 值 |
|---|---|
| 编号 | LAB-DET-004 |
| 日期 | 2026-10-24 |
| 执行 | lead（AI） |
| 分类 | 防守 / 检测验证 |
| 风险级别 | 低 |
| 状态 | 完成 |

## 1. 目标

把 SQLi/XSS 检测规则跑在 DVWA 容器的真实访问日志上，验证命中与误报。

## 2. 范围与环境

- 从宿主机经 host-only SSH 进 lab-linux（管理地址脱敏）；
- 取 `docker logs --since 4h dvwa` 中含 sqli/xss_r 的 30 行；
- 用 detect_web_sqli.mjs / detect_web_xss.mjs 匹配。

## 3. 假设

H1：真实攻击请求能被规则命中；H2：正常请求不被误报。

## 4. 步骤

1. 修复 host-only 路由（给管理口加更具体的 /24 路由），SSH 打通；
2. 导出日志到 data/security/detections/live-dvwa.log；
3. 跑两条规则，查看 ALERT 行。

## 5. 结果

| 规则 | 命中 | 说明 |
|---|---|---|
| SQLi | 4 | 去重后 30 行里 4 行真实 `id=1%27%20OR%20%271%27%3D%271` 请求 |
| XSS | 1 | 一行真实 `name=%3Cscript%3Ealert(1)%3C%2Fscript%3E` |
| 误报 | 0 | 分母 30 行（sort -u 去重后），未命中正常请求/PHP notice |

## 6. 证据

- 日志：data/security/detections/live-dvwa.log（30 行，sort -u 去重；含真实请求）；
- 输出：SQLi hits=4 total=30；XSS hits=1 total=30；
- 客户端地址为 Windows 靶场（脱敏）。

## 7. 分析

事实：规则在真实日志上命中实际攻击请求，未误报正常请求。推断：当前样本只覆盖 GET 型 payload，POST body 不写访问日志，命令注入的命令行不在日志里。

## 8. 风险与影响

只覆盖 URL 查询串；POST/JSON 攻击需要应用层日志或进程事件。

## 9. 修复与后续

- 接应用层日志/EDR；
- 对 POST 参数做解码后再匹配；
- 未解决：命令注入的真实进程日志还未接。

## 10. 结论

完成：真实日志上 SQLi/XSS 规则均命中，误报 0。
