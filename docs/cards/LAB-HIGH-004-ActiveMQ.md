# LAB-HIGH-004 CVE-2023-46604 ActiveMQ OpenWire RCE

- 对象：本地 vulhub/activemq:5.17.3 容器（训练靶场）
- 类型：OpenWire 反序列化 / RCE
- 复现：validator xml 模式确认 XML 加载；rce 模式执行固定 id，返回 uid=0(root)
- 证据：data/security/experiments/CVE-2023-46604/evidence.txt；报告 LAB-HIGH-004
- 影响：61616 暴露即可远程执行，CVSS 10.0
- 修复：升级 ActiveMQ、限制 61616
- 置信度：高（只跑固定命令，未做反弹 shell）
