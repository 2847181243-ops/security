# 实验报告：LAB-HIGH-007 CVE-2024-23897 Jenkins CLI 任意文件读取

## 文档控制

| 项 | 值 |
|---|---|
| 编号 | LAB-HIGH-007 |
| 日期 | 2026-10-24（Asia/Hong_Kong，22:20） |
| 执行 | lead（AI） |
| 分类 | 高危漏洞复现 |
| 风险级别 | 高（本地靶场） |
| 状态 | 完成 |

## 1. 目标

在本地 Jenkins 2.441 复现 CVE-2024-23897：CLI 的 @ 文件展开导致任意文件读取。

## 2. 范围与环境

- 宿主 Windows，Jenkins 2.441 war，端口 8087，prefix /jenkins；
- CLI：jenkins-cli.jar 3,623,400 字节；
- 读取目标：主证据为自建 proof 文件；另试过 /etc/passwd（Windows 不存在）与 C:\Windows\win.ini（有输出片段，未作为主证据）；
- 隔离：Jenkins 默认监听 0.0.0.0:8087，未做访问限制；只从本机 127.0.0.1 访问。

## 3. 假设

H1：help 命令的 @path 会展开文件；H2：无认证也能读到内容。

## 4. 步骤

1. 启动 Jenkins 2.441；
2. 下载 jenkins-cli.jar；
3. 执行 help "@D:\...\secret-proof.txt"；
4. 观察错误信息里的文件内容。

## 5. 结果

| 检查项 | 预期 | 实际 | 结论 |
|---|---|---|---|
| 文件读取 | 内容出现在输出 | Too many arguments: second-line；default: jenkins-file-read-ok | 通过 |
| 认证 | 不需要 | help 命令未登录 CLI 成功；其他命令未测 | 通过 |

## 6. 证据

- 证据文件：data/security/experiments/CVE-2024-23897/evidence.txt；
- proof 文件：lab/jenkins/secret-proof.txt（内容 jenkins-file-read-ok / second-line）；
- CLI 输出见 evidence。

## 7. 分析

事实：@ 路径被展开，proof 文件内容进入 CLI 参数并回显；win.ini 也被读到片段。推断：可读 Jenkins 配置/密钥，进一步可能 RCE；未读真实密钥。

## 8. 风险与影响

未认证即可读服务器文件；CVSS 9.8，KEV 2024-08-19。靶场只在宿主回环。

## 9. 修复与后续

- 升级 Jenkins 到 2.442/LTS 2.426.3+；
- 限制 CLI 访问；
- 未解决：未读真实密钥、未做 RCE。

## 10. 结论

通过：Jenkins CLI 任意文件读取复现成功。
