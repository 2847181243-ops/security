# 本地恶意软件靶场设计（2026-10-24 初稿）

## 现状

- Windows 11 家庭版，VirtualBox 7.2.4，31 GB 内存，D 盘剩 188 GB。
- 已有虚拟机 `lianxi`（16 GB 内存，关机）——不是靶场，不动它。
- 没有现成 ISO；Windows 虚拟机需要单独下载评估镜像。

## 已建配置（2026-10-24）

- VM `lab-win`：Windows11_64，8 GB / 4 vCPU / 80 GB VDI，EFI + TPM 2.0，快照 `clean`。
- 网卡：`intnet` / `labnet`；剪贴板、拖放、USB、音频关闭。
- 控制脚本：`runtime/security/lab.mjs`；安装：`install_lab.ps1`；阶段 0：`stage0.ps1` + `run_stage0.ps1`。

## 隔离设计

- 新建专用虚拟机 `lab-win`，VDI 放 D 盘，4 vCPU / 8 GB 内存 / 80 GB 动态磁盘。
- 网卡 1：Internal Network，名字 `labnet`；默认不接桥接、不接 NAT。
- 需要往虚拟机送样本时，临时加 Host-Only 网卡，传完立即移除；或做成 ISO 挂载。
- 共享文件夹、剪贴板、拖放、USB 直通、音频全部关闭。
- 干净快照 `clean`；每个实验前后各打一次，实验完回滚。

## 宿主红线

1. 样本不在宿主落地、不解压、不双击、不加 Defender 排除项。
2. 宿主只记录哈希、文件名、来源、命令、观察结果。
3. 不上传样本到公共沙箱；不上传含个人信息的文件。
4. 虚拟机断网演练；查资料在宿主做。

## 分阶段实验

- 阶段 0：EICAR 测试串，验证 Defender 会拦，验证快照回滚。
- 阶段 1：可疑文件静态分诊——哈希、文件类型、字符串，不执行。
- 阶段 2：自写的"类恶意行为"脚本（写启动项、弹计算器），观察行为后回滚。
- 阶段 3：真实样本，只在用户明确同意后，虚拟机内、断网、快照保护下做。

## 待办

- 下载 Windows 11 评估 ISO（约 5–6 GB），建 `lab-win`。
- 装 Sysinternals（Procmon、Autoruns）与 Process Explorer 到虚拟机。
- 写 VBoxManage 脚本：建网、建盘、快照、回滚、导出日志。
- 产出 `malware-lab` skill（已建骨架）。

## 隔离验证（2026-10-24 实测）

- 虚拟机内 `ping -n 2 8.8.8.8`：100% loss，transmit failed；
- `ipconfig`：只有 169.254 链路本地地址，没有默认网关；
- 宿主侧 `showvminfo`：nic1=intnet，intnet1=labnet，无 NAT/桥接；
- 结论：默认断网，样本出不去。

## 最终硬化（2026-10-24）

- 剪贴板、拖放：disabled；USB、音频、USB 读卡器：off；第二网卡 none。
- Windows 安装 ISO 已卸载；Guest Additions ISO 保留。
- 无 VM 级共享文件夹（只有 VirtualBox 全局默认映射，未挂给本机）。
- 快照：clean 已删除，保留 `baseline-clean`（Windows11 + GA，断网、剪贴板关）。
- 网络：nic1=intnet/labnet；guest 内 ping 8.8.8.8 100% 失败，仅 169.254，无网关。
