# 实验报告：LAB-DET-008 LSASS 访问检测

## 文档控制

| 项 | 值 |
|---|---|
| 编号 | LAB-DET-008 |
| 日期 | 2026-10-24 |
| 执行 | lead（AI） |
| 分类 | 防守 / 检测工程 |
| 风险级别 | 低 |
| 状态 | 完成（合成事件） |

## 1. 目标

为凭据窃取中最常见的 LSASS 访问写 Sigma 规则，验证命中与预期误报。

## 2. 范围与环境

- 规则：docs/security/detections/lsass-access.yml；
- 脚本：runtime/security/detect_lsass.mjs；
- 事件：4 条合成 process_access（dump.exe、svchost、MsMpEng、notepad）。

## 3. 假设

H1：dump.exe 用 0x1010 访问 lsass 命中；H2：EDR 自身用 0x1410 也会命中（已知误报）。

## 4. 步骤

1. 规则匹配 TargetImage 为 lsass.exe 且 GrantedAccess 含 0x1010/0x1410/0x143a；
2. 构造 4 条事件；
3. 统计命中。

## 5. 结果

| 事件 | 结果 |
|---|---|
| dump.exe -> lsass 0x1010 | ALERT |
| svchost -> lsass 0x1000 | ok |
| MsMpEng -> lsass 0x1410 | ALERT（EDR 误报） |
| notepad -> notepad 0x1010 | ok |

hits=2 total=4。

## 6. 证据

- 证据文件：data/security/experiments/LAB-DET-008/evidence.txt；
- 规则：docs/security/detections/lsass-access.yml；
- 脚本：runtime/security/detect_lsass.mjs。

## 7. 分析

事实：规则命中 dump.exe 和 Defender，未命中普通访问。推断：必须给安全产品进程加白名单，否则告警会被 EDR 自己刷屏。

## 8. 风险与影响

0x1010 只是常见掩码之一；直接系统调用或内核读取可绕过。

## 9. 修复与后续

- 给 MsMpEng/EDR 加白名单；
- 结合签名与父进程；
- 未解决：Sigma 引擎未执行，只跑等价逻辑。

## 10. 结论

通过：规则行为符合预期，已知 EDR 误报已记录。
