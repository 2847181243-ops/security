# 实验报告：LAB-HIGH-002 CVE-2022-22965 Spring4Shell

## 文档控制

| 项 | 值 |
|---|---|
| 编号 | LAB-HIGH-002 |
| 日期 | 2026-10-24 |
| 执行 | lead（AI） |
| 分类 | 高危漏洞复现 |
| 风险级别 | 高（本地靶场） |
| 状态 | 完成 |

## 1. 目标

在 labnet 内复现 CVE-2022-22965：Spring MVC 数据绑定写 JSP，证明代码执行。

## 2. 范围与环境

- lab-linux + Docker，镜像 vulhub/spring-webmvc:5.3.17；
- 容器 spring4shell，端口 8082；
- 拉镜像时临时 NAT，验证后撤掉，只保留 labnet；
- 只写一个回显 poc-ok 的 JSP，不写命令后门。

## 3. 假设

H1：Tomcat WAR 部署下可用 class.module.classLoader 改日志 pattern；H2：写入的 JSP 能执行。

## 4. 步骤

1. 拉镜像并 run -p 8082:8080；
2. 首页 200 确认服务；
3. GET 请求带 class.module.classLoader...pattern，pattern 写入 JSP 回显 poc-ok；
4. 访问 /tomcatwar.jsp；
5. 查容器内文件。

## 5. 结果

| 检查项 | 预期 | 实际 | 结论 |
|---|---|---|---|
| 首页 | 200 | HTTP=200 | 通过 |
| 写 JSP | 文件生成 | tomcatwar.jsp 56 字节 | 通过 |
| JSP 执行 | 输出 poc-ok | JSP_HTTP=200，body=poc-ok | 通过 |

## 6. 证据

- 证据文件：data/security/experiments/CVE-2022-22965/evidence.txt；
- 时间：2026-10-24T12:27:11Z；
- 容器：vulhub/spring-webmvc:5.3.17，0.0.0.0:8082->8080；
- JSP 内容：只回显 poc-ok。

## 7. 分析

事实：攻击者控制的 JSP 被写入并执行，等价于代码执行。推断：可进一步执行命令，但未做；默认 Spring Boot jar 不适用该利用链。

## 8. 风险与影响

Tomcat WAR 部署的 Spring MVC 可被写 JSP；靶场隔离，未执行系统命令。

## 9. 修复与后续

- 升级 Spring Framework；无法升级时限制数据绑定字段；
- 检测：请求参数含 class.module.classLoader；
- 未解决：未测命令执行、未测 Spring Boot jar 形态。

## 10. 结论

通过：Spring4Shell 写 JSP 并执行成功。
