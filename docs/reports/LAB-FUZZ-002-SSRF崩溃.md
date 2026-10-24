# 实验报告：LAB-FUZZ-002 SSRF 端点重复响应崩溃

## 文档控制

| 项 | 值 |
|---|---|
| 编号 | LAB-FUZZ-002 |
| 日期 | 2026-10-24 |
| 执行 | lead（AI） |
| 分类 | 模糊测试 / 自建靶场 |
| 风险级别 | 中 |
| 状态 | 完成 |

## 1. 目标

对 /fetch?url= 做畸形 URL 模糊测试，找崩溃与双重响应。

## 2. 范围与环境

- 目标：lab/webapp/server.mjs，127.0.0.1:8099；
- 脚本：runtime/security/fuzz_ssrf.mjs，200 条随机 URL（http/file/gopher/ipv6/超时/非法主机）；
- 只打本机靶场。

## 3. 假设

H1：异常 URL 可能让超时和数据回调同时触发，导致重复写响应。

## 4. 步骤

1. 启动 server；
2. 随机 URL 请求 /fetch；
3. 观察崩溃；
4. 在 send() 加 headersSent/writableEnded 保护后重跑。

## 5. 结果

| 阶段 | 数字响应 | 连接错误 | 存活 |
|---|---|---|---|
| 修复前 | 4 | 196 | false（ERR_HTTP_HEADERS_SENT） |
| 修复后 | 166 | 34（超时/不可达） | true |

## 6. 证据

- 证据文件：data/security/experiments/LAB-FUZZ-002/evidence.txt；
- 修复：send() 先判 res.headersSent/writableEnded，已发过就返回；
- 崩溃栈：Error [ERR_HTTP_HEADERS_SENT] at send server.mjs:9。

## 7. 分析

事实：/fetch 的超时/错误回调在响应已发后再次 send，抛未捕获异常导致进程退出。修复后 200 条请求无崩溃。推断：所有异步回调路径都应统一做“只响应一次”保护。

## 8. 风险与影响

靶场可被单请求打崩；生产会造成 DoS。

## 9. 修复与后续

- 已加 send 保护；
- 给 fetch 加 settled 标志与 URL scheme 白名单；
- 未解决：未做覆盖率引导 fuzz。

## 10. 结论

通过：fuzz 找到并修复 SSRF 端点重复响应崩溃。
