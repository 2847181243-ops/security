# 实验报告：LAB-PT-001 靶场侦察与端口识别

## 文档控制

| 项 | 值 |
|---|---|
| 编号 | LAB-PT-001 |
| 日期 | 2026-10-24 |
| 执行 | lead（AI） |
| 分类 | 渗透测试 / 侦察 |
| 风险级别 | 低 |
| 状态 | 完成（受限） |

## 1. 目标

从 Windows 靶场 VM 对 Linux 靶场做端口发现和 HTTP 指纹，验证攻击面记录流程。

## 2. 范围与环境

- 攻击机：lab-win（Windows 11）；
- 目标：lab-linux（脱敏地址 192.0.2.10），仅 labnet；
- 授权：本机靶场，未扫任何外部地址。

## 3. 假设

H1：8080/3000 开放；H2：能读到 Server 头。

## 4. 步骤

1. 下载 Nmap 7.92 win32 到 Windows VM，解压运行 --version；
2. nmap 无输出、nmap.out 为 0 字节（疑缺 Npcap/需提权）；
3. 改用 PowerShell TcpClient 连接目标端口，发 GET / 读状态行与 Server 头。

## 5. 结果

| 端口 | 状态 | 响应 | Server |
|---|---|---|---|
| 8080 | OPEN | HTTP/1.1 302 Found | Apache/2.4.25 (Debian) |
| 3000 | OPEN | HTTP/1.1 200 OK | 未返回 |

## 6. 证据

- 证据文件：data/security/experiments/LAB-PT-001/evidence.txt；
- nmap 证据：data/security/experiments/LAB-PT-001/nmap.out（0 字节）；
- 脚本：lab/win_portscan.ps1，只探 8080/3000。

## 7. 分析

事实：两个端口开放，8080 泄露 Apache/2.4.25。推断：旧组件可能有已知漏洞，但未验证可利用性；PHP 版本没有证据，不作结论。

## 8. 风险与影响

版本泄露可辅助选攻击路径；旧组件可能有已知 CVE，但靶场只在 labnet，风险受控。

## 9. 修复与后续

- 修 Nmap：装 Npcap（需管理员）或改用 Linux 攻击机；
- 下一步：Burp/sqlmap 对 DVWA 做请求级测试；
- 未解决：nmap 无法在无 Npcap 的 Windows 上运行。

## 10. 结论

完成（受限）：端口和指纹拿到了，Nmap 这条工具链没通。
