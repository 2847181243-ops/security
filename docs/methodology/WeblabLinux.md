# Linux Web 靶场：Debian + Docker + DVWA/Juice Shop

日期：2026-10-24

## 环境

- lab-linux：Debian 13.7 minimal，2 vCPU / 4 GB / 40 GB；
- Docker 26.1.5，Compose 2.26.1，服务 active；
- 镜像经 docker.1ms.run 镜像站拉取：`bkimminich/juice-shop`、`vulnerables/web-dvwa`；
- 容器：dvwa 映射 8080，juice 映射 3000。

## 实测

- `curl http://127.0.0.1:8080/` → 302（DVWA setup 跳转）；
- `curl http://127.0.0.1:3000/` → 200（Juice Shop 已监听）；
- `docker ps` 显示两个容器 Up。

## 当前网络状态

- 安装/拉镜像期间临时用 NAT；装完要撤掉，改回 `intnet/labnet` 静态地址；
- 隔离基线：linux-base 快照；装好 Docker 后的状态：weblab-linux 快照。

## 待办

- 撤 NAT，配 labnet 静态 IP（如 192.0.2.10/24），与 Windows VM 互通；
- DVWA 首次 setup 建库；
- 从 Windows VM 浏览器访问，做 SQLi/XSS 练习；
- 练完 restore weblab-linux。

## 跨 VM 访问（link-local 方案）

- Windows 侧 netsh 配静态 IP 需要提权，guestcontrol 默认非提权，失败；
- 改用 APIPA：Windows 自动 192.0.2.20/16，Linux 加 192.0.2.10/16；
- 实测：Windows ping Linux 通，HTTP 8080=200、3000=200。
