# LAB-HIGH-002 CVE-2022-22965 Spring4Shell

- 对象：本地 Vulhub spring-webmvc 5.3.17 容器（训练靶场）
- 类型：数据绑定写 JSP / RCE
- 复现：GET 带 class.module.classLoader...pattern，写入 tomcatwar.jsp 回显 poc-ok
- 证据：JSP_HTTP=200，body=poc-ok，文件 56 字节；报告 LAB-HIGH-002
- 影响：Tomcat WAR 部署下代码执行，CVSS 9.8
- 修复：升级 Spring，限制数据绑定字段
- 置信度：高（未测命令执行）
