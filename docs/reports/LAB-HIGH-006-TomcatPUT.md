# 实验报告：LAB-HIGH-006 CVE-2017-12615 Tomcat PUT 写 JSP

## 文档控制

| 项 | 值 |
|---|---|
| 编号 | LAB-HIGH-006 |
| 日期 | 2026-10-24 |
| 执行 | lead（AI） |
| 分类 | 高危漏洞复现 |
| 风险级别 | 高（本地靶场） |
| 状态 | 完成 |

## 1. 目标

在本地 Tomcat 7.0.79 复现 CVE-2017-12615：PUT 方法写 JSP 并执行。

## 2. 范围与环境

- 宿主 Windows，Tomcat 7.0.79，端口 8086；
- conf/web.xml 的 DefaultServlet 设 readonly=false（漏洞前提）；
- 只写回显 put-poc-ok 的 JSP，不写命令后门。

## 3. 假设

H1：PUT /1.jsp/ 可绕过后缀检查；H2：写入的 JSP 能执行。

## 4. 步骤

1. 下载并配置 Tomcat 7.0.79；
2. 启动 8086；
3. PUT /1.jsp/，body 为回显 JSP；
4. GET /1.jsp。

## 5. 结果

| 检查项 | 预期 | 实际 | 结论 |
|---|---|---|---|
| PUT | 201 | HTTP 201 | 通过 |
| GET | 200 且回显 | HTTP 200，put-poc-ok | 通过 |

## 6. 证据

- 证据文件：data/security/experiments/CVE-2017-12615/evidence.txt；
- 请求脚本：lab/tomcat7/test_put.mjs；
- JSP 只回显固定字符串。

## 7. 分析

事实：PUT 写入了 JSP 并被执行。推断：换成命令执行 JSP 即可 RCE，本轮只做回显；readonly=false 是前提。

## 8. 风险与影响

默认配置通常 readonly=true；一旦关闭或配置错误，可被写 webshell。靶场只在宿主回环。

## 9. 修复与后续

- 保持 readonly=true，升级 Tomcat；
- 检测：PUT 到 .jsp/ 或异常后缀；
- 未解决：未测命令执行。

## 10. 结论

通过：PUT 写 JSP 并执行成功。
