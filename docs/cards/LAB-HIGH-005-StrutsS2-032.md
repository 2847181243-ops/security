# LAB-HIGH-005 CVE-2016-3081 Struts2 S2-032

- 对象：本地 Tomcat 8.5.19 + struts2-showcase 2.3.28
- 类型：OGNL 注入 / RCE
- 复现：method: 前缀 payload，固定 curl 回调命中 /s2
- 证据：data/security/experiments/LAB-HIGH-005/evidence.txt；报告 LAB-HIGH-005
- 影响：DMI 开启时可 RCE，CVSS 8.1
- 修复：关闭 DMI、升级 Struts
- 置信度：高（只做固定回调）
