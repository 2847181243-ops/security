# 安全研究目录

## 入口

- 阶段总结：阶段总结.md
- 计划与进度：计划进度.md、0day-研究提案.md
- 实验报告：实验报告/索引.md、实验报告/QA-汇总.md
- 漏洞卡：vuln-cards/README.md
- 复现步骤：runbooks/README.md
- 检测规则：detections/覆盖矩阵.md、detections/指标.md、detections/流水线.md
- 情报：intel/漏洞优先级.md、intel/KEV-近30天.md、intel/KEV-趋势.md、intel/下一步候选.md

## 当前数字

- 报告 53 份，结构检查全 PASS；
- 高危复现 6 个：CVE-2021-41773、CVE-2022-22965、CVE-2023-46604、CVE-2016-3081、CVE-2017-12615、CVE-2024-23897；
- Sigma 17 条、Suricata 3 条；真实日志验证 4 条；
- 知识库 135 张，security 49 张；
- 审计 6 份（含 1 次扫描失败）、fuzz 2 次。

## 约束

只做本地/授权靶场，最小 PoC，不写后门、不碰第三方系统。
