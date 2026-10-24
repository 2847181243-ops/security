# Runbook：Struts2 S2-032（CVE-2016-3081）本地复现

## 前置

- 宿主 Java 8 JRE + Tomcat 8.5.19；
- struts2-showcase 2.3.28 war；
- 回调监听 127.0.0.1:9999，只记录请求。

## 步骤

1. 解压 Tomcat，改 server.xml 端口 8085；
2. 部署 showcase.war，启动；
3. 启动回调监听；
4. 发 method: OGNL payload，cmd 固定为 curl 回调；
5. 查回调日志 HIT /s2；
6. 收尾：停止 Tomcat 与监听。

## 证据

- data/security/experiments/LAB-HIGH-005/；
- 报告 LAB-HIGH-005；卡 LAB-HIGH-005。
