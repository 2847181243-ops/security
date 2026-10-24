# 实验报告：LAB-FUZZ-001 Webapp URL 解析模糊测试

## 文档控制

| 项 | 值 |
|---|---|
| 编号 | LAB-FUZZ-001 |
| 日期 | 2026-10-24 |
| 执行 | lead（AI） |
| 分类 | 模糊测试 / 自建靶场 |
| 风险级别 | 中 |
| 状态 | 完成 |

## 1. 目标

对 lab/webapp 的 HTTP 解析做随机路径模糊测试，找崩溃与 5xx。

## 2. 范围与环境

- 目标：lab/webapp/server.mjs，监听 127.0.0.1:8099；
- 脚本：runtime/security/fuzz_webapp.mjs，300 条随机路径/参数；
- 只打本机靶场，不碰外部。

## 3. 假设

H1：随机畸形 URL 可能触发未捕获异常；H2：修复后应无崩溃。

## 4. 步骤

1. 启动 server；
2. 随机生成 300 条路径（含 %、{}、引号、超长参数）；
3. 统计状态码、连接错误、崩溃；
4. 修复 URL 解析后重跑。

## 5. 结果

| 阶段 | 数字请求 | 连接错误 | 5xx | 存活 |
|---|---|---|---|---|
| 修复前 | 17 | 283 | 0 | ECONNREFUSED（已崩） |
| 修复后 | 300 | 0 | 0 | 200 |

修复前崩溃栈：TypeError: Invalid URL，server.mjs:9。

## 6. 证据

- 证据文件：data/security/experiments/LAB-FUZZ-001/evidence.txt；
- 脚本：runtime/security/fuzz_webapp.mjs；
- 修复：new URL 包 try/catch，非法请求返回 400。

## 7. 分析

事实：一个畸形 URL 就能让进程退出，属于未处理异常型 DoS。修复后 300 条随机请求无崩溃、无 5xx。推断：其他解析点（query 长度、fetch URL）仍需单独 fuzz。

## 8. 风险与影响

靶场自身崩溃会中断练习；同类写法在生产会造成可用性问题。

## 9. 修复与后续

- 已在 server.mjs 加 try/catch；
- 增加请求体大小/字段长度限制；
- 未解决：未做覆盖率引导 fuzz。

## 10. 结论

通过：fuzz 找到并修复 URL 解析崩溃。
