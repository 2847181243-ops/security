# LAB-HIGH-007 CVE-2024-23897 Jenkins CLI 文件读取

- 对象：本地 Jenkins 2.441（Windows）
- 类型：CLI @ 路径展开 / 任意文件读取
- 复现：help "@proof.txt" 输出 jenkins-file-read-ok、second-line
- 证据：data/security/experiments/CVE-2024-23897/evidence.txt；报告 LAB-HIGH-007
- 影响：未认证读服务器文件，CVSS 9.8，KEV 2024-08-19
- 修复：升级 2.442/LTS 2.426.3+，限制 CLI
- 置信度：高（只读自建 proof 文件）
