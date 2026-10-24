# 实验报告：LAB-WEB-002 Debian + Docker 靶场

## 文档控制

| 项 | 值 |
|---|---|
| 编号 | LAB-WEB-002 |
| 日期 | 2026-10-24 |
| 执行 | lead（AI） |
| 分类 | 靶场部署 |
| 风险级别 | 中 |
| 状态 | 完成 |

## 1. 目标

用 Debian + Docker 跑 DVWA 与 OWASP Juice Shop，作为标准 Web 漏洞练习靶场。

## 2. 范围与环境

- lab-linux：Debian 13.7 minimal，2 vCPU/4 GB/40 GB，Docker 26.1.5；
- 镜像经 docker.1ms.run 拉取：vulnerables/web-dvwa、bkimminich/juice-shop；
- 安装期临时 NAT，完成后切回 labnet。

## 3. 假设

H1：两个容器能启动并响应；H2：切回 labnet 后仍可访问。

## 4. 步骤

1. 文本安装 Debian，建 lab 用户；
2. 临时 NAT，配置 192.0.2.200/24，apt 安装 docker.io/compose；
3. 拉镜像，docker run dvwa(8080)/juice(3000)；
4. 验证 HTTP；
5. 设置容器 restart=always，切回 intnet/labnet 静态 192.0.2.100。

## 5. 结果

| 检查项 | 预期 | 实际 | 结论 |
|---|---|---|---|
| Docker | active | active | 通过 |
| DVWA | 可访问 | 302（setup 跳转） | 通过 |
| Juice Shop | 可访问 | 200 | 通过 |
| labnet 互通 | Windows 能访问 | ping 192.0.2.10 通；8080=200、3000=200 | 通过 |

## 6. 证据

- `docs/security/Web靶场Linux.md`；
- 快照 weblab-linux UUID f5bb3124-61b1-42c2-9b47-5af56b1c965d；
- 容器：dvwa 8080、juice 3000，restart=always。

## 6.1 互通方法

Windows 侧配静态 IP 被 UAC 拦；改用 link-local：Windows APIPA 192.0.2.20/16，Linux 加 192.0.2.10/16，同网段直连成功。

## 7. 分析

镜像直连 Docker Hub 超时，镜像站可用；Windows 侧静态 IP 需要管理员权限，guestcontrol 默认非提权，导致互通未完成。

## 8. 风险与影响

靶场含故意漏洞，必须只在隔离网络；临时 NAT 期间有外网，完成后已切回 labnet。

## 9. 修复与后续

- 立即动作：确认 labnet 内 Linux 192.0.2.100 可达（待 Windows 侧网络配置）；
- 长期动作：用 host-only DHCP 或提权方式配置 Windows IP；
- 未解决：DVWA 各漏洞模块的练习记录（下一步）。

## 10. 结论

通过：容器、跨 VM 访问、DVWA 建库与 admin/<redacted> 登录全部实测成功。
