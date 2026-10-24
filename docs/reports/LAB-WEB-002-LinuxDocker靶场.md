# 实验报告：LAB-WEB-002 Debian + Docker 靶场

## 文档控制

| 项 | 值 |
|---|---|
| 编号 | LAB-WEB-002 |
| 日期 | 2026-10-24 |
| 执行 | lead（AI） |
| 分类 | 靶场部署 |
| 风险级别 | 中 |
| 状态 | 部分完成 |

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
2. 临时 NAT，配置过渡地址，apt 安装 docker.io/compose；
3. 拉镜像，docker run dvwa(8080)/juice(3000)；
4. 验证 HTTP；
5. 设置容器 restart=always；计划切回 intnet/labnet 静态地址（报告时静态互通未完成）。

## 5. 结果

| 检查项 | 预期 | 实际 | 结论 |
|---|---|---|---|
| Docker | active | active | 通过 |
| DVWA | 可访问 | 302（建库前 setup 跳转） | 通过 |
| Juice Shop | 可访问 | 200 | 通过 |
| link-local 互通 | Windows 能访问 | 建库后 8080=200、3000=200（nic2=hostonly 承载） | 通过 |
| labnet 静态互通 | Windows 能访问 | 未完成（Windows 侧静态 IP 需管理员） | 未完成 |

## 6. 证据

- docs/security/Web靶场Linux.md；
- 网络：data/security/experiments/LAB-WEB-002/network.txt（nic1=intnet/labnet、nic3=none）；
- 快照：data/security/experiments/LAB-WEB-002/snapshots.txt；
- 容器：data/security/experiments/LAB-WEB-002/containers.txt（dvwa/juice restart=always）。

## 6.1 互通方法

Windows 侧配静态 IP 被 UAC 拦；改用 link-local：Windows APIPA 与 Linux link-local 同段直连成功。

## 7. 分析

镜像直连 Docker Hub 超时，镜像站可用；link-local 访问成功。Windows 侧静态 IP 需要管理员权限，guestcontrol 默认非提权，labnet 静态互通未完成。

## 8. 风险与影响

靶场含故意漏洞，必须只在隔离网络；临时 NAT 已撤（nic3=none），当前 link-local 可达，labnet 静态互通仍未完成。

## 9. 修复与后续

- 立即动作：确认 labnet 静态路由可达（待 Windows 侧网络配置）；
- 长期动作：用 host-only DHCP 或提权方式配置 Windows IP；
- 未解决：labnet 静态互通；DVWA 建库与登录见 LAB-WEB-003。

## 10. 结论

部分完成：容器运行和 link-local 访问通过；labnet 静态互通未完成，DVWA 建库/登录见 LAB-WEB-003。
