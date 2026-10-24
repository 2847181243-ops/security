# Web 靶场部署：Windows VM 内的零依赖 Node 应用

日期：2026-10-24
环境：lab-win（Windows 11 LTSC 26100，Guest Additions 7.2.4，Internal Network labnet，断网）

## 做法

1. 宿主下载 Node v24.10.0 Windows x64 zip（36 MB），用 guestcontrol 拷进 C:\lab\node.zip；
2. 虚拟机内 `Expand-Archive` 解到 C:\lab\node；
3. 把 `lab/webapp/server.mjs` 和 files/ 拷进 C:\lab\webapp；
4. 虚拟机内启动：`C:\lab\node\node-v24.10.0-win-x64\node.exe C:\lab\webapp\server.mjs`；
5. 访问 `http://127.0.0.1:8099/`。

## 实测证据

- 主页返回 `<h1>lab webapp</h1>...`；
- `/idor?id=2` 返回 `{"id":2,"name":"bob","role":"admin"}`；
- 宿主侧同代码还验过 XSS、SQLi、路径穿越（见 vuln-cards）。

## 边界

- 只跑在 lab VM 内，监听 127.0.0.1，不接外网；
- 靶场代码是我们自己写的训练用代码，不是真实产品；
- 下一步：DVWA/Juice Shop 用 Linux+Docker 另建，避免把 Node 依赖塞进这台。
