# 实验报告：LAB-HIGH-003 CVE-2021-44228 JNDI 触发（受限）

## 文档控制

| 项 | 值 |
|---|---|
| 编号 | LAB-HIGH-003 |
| 日期 | 2026-10-24 |
| 执行 | lead（AI） |
| 分类 | 高危漏洞复现（受限） |
| 风险级别 | 高 |
| 状态 | 部分完成 |

## 1. 目标

在本地 Java 8 上验证 Log4j2 2.14.1 的 JNDI 注入是否会被触发，只做回调证明，不加载远程类。

## 2. 范围与环境

- 宿主 Windows，Java 1.8.0_511；
- log4j-core/api 2.14.1，测试类只调用 logger.error(payload)；
- 回调监听 127.0.0.1:1389，只记录连接，不返回 LDAP 响应；
- 不加载远程类、不执行命令。

## 3. 假设

H1：payload 触发 JNDI LDAP 连接；H2：不提供 LDAP 响应时无代码执行。

## 4. 步骤

1. 下载 2.14.1 jar，编译 Log4jTest；
2. 启动 1389 回调监听；
3. 运行 java，参数为 jndi ldap payload；
4. 查监听日志。

## 5. 结果

| 检查项 | 预期 | 实际 | 结论 |
|---|---|---|---|
| 控制台 | 打印日志 | ERROR 行 + LOGGED | 记录 |
| 回调 | 有连接 | CONN 127.0.0.1 bytes=14，LDAP bind hex 300c0201... | 通过 |
| RCE | 未做 | 无远程类、无命令 | 未验证 |

## 6. 证据

- 证据文件：data/security/experiments/CVE-2021-44228/evidence.txt；
- 监听日志：LISTEN 127.0.0.1:1389；CONN bytes=14 hex=300c020101600702010304008000；
- 测试类：lab/log4shell/Log4jTest.java。

## 7. 分析

事实：Log4j2 对 payload 发起了 LDAP 连接，JNDI 注入被触发。推断：本机 JDK 8u511 默认关闭 trustURLCodebase，LDAP codebase 远程类不会加载；完整 RCE 需要本地 gadget 链，本轮未做，因此只算 JNDI 触发。

## 8. 风险与影响

JNDI 出站连接可被用于外带和远程类加载；生产环境要禁 lookup、限制出站。

## 9. 修复与后续

- 升级 Log4j2 到修复版本；无法升级时关闭 JNDI/lookup；
- 检测：日志/参数中的 jndi 语法；
- 未解决：未做远程类加载与命令执行；JDK 8u191+ 的 trustURLCodebase 限制是主要障碍。

## 10. 结论

部分完成：JNDI LDAP 回调已触发，未验证代码执行。
