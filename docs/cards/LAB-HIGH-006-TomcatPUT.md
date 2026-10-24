# LAB-HIGH-006 CVE-2017-12615 Tomcat PUT 写 JSP

- 对象：本地 Tomcat 7.0.79（readonly=false）
- 类型：任意文件写入 / JSP 执行
- 复现：PUT /1.jsp/ 返回 201，GET /1.jsp 返回 put-poc-ok
- 证据：data/security/experiments/CVE-2017-12615/evidence.txt；报告 LAB-HIGH-006
- 影响：写 webshell 的前置，取决于 readonly 配置
- 修复：保持 readonly=true、升级 Tomcat
- 置信度：高（仅回显，无命令执行）
