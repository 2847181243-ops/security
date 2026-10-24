# 实验报告：LAB-HIGH-005 Struts2 S2-032 RCE

## 文档控制

| 项 | 值 |
|---|---|
| 编号 | LAB-HIGH-005 |
| 日期 | 2026-10-24 |
| 执行 | lead（AI） |
| 分类 | 高危漏洞复现 |
| 风险级别 | 高（本地靶场） |
| 状态 | 完成 |

## 1. 目标

在本地 Tomcat + Struts2 showcase 上复现 CVE-2016-3081（S2-032），只执行固定回调命令。

## 2. 范围与环境

- 宿主 Windows，Tomcat 8.5.19，struts2-showcase 2.3.28，端口 8085；
- DMI 在 struts.xml 中为 true；
- 回调监听 127.0.0.1:9999，只记录请求，不接收数据；
- 执行命令固定为 curl 回调，不做 shell、不落文件；
- 隔离：宿主本地端口 8085，只在本机验证，未测外部暴露；
- 权限：普通用户运行，无提权；测试后 Tomcat 已停止；
- 快照：未用 VM 快照（宿主临时进程）。

## 3. 假设

H1：method: 前缀可注入 OGNL；H2：OGNL 能执行固定命令。

## 4. 步骤

1. 下载 Tomcat 与 showcase war，部署并启动 8085；
2. 启动 9999 回调监听；
3. 发带 method: OGNL 的请求，cmd 为固定 curl；
4. 查回调日志。

## 5. 结果

| 检查项 | 预期 | 实际 | 结论 |
|---|---|---|---|
| 首页 | 200 | 200（Tomcat 日志 Server startup，见 lab/struts/apache-tomcat-8.5.19/logs） | 通过 |
| 回调 | 收到 /s2 | HIT GET /s2 | 通过 |
| 响应 | 可能 500 | HTTP 500，9,041 字节 | 记录 |

## 6. 证据

- 证据文件：data/security/experiments/LAB-HIGH-005/evidence.txt；
- 回调日志：HIT GET /s2；
- 请求脚本：lab/struts/test_s2_032_callback.mjs。

## 7. 分析

事实：固定 curl 命令被执行，回调命中；HTTP 500 是 SiteMesh 装饰器在输出后报错，不影响命令执行。推断：换成任意命令即可进一步利用，但本轮未做。

## 8. 风险与影响

DMI 开启时 method: 前缀可 RCE；CVSS 8.1 来自 NVD，KEV 加入日期 2026-10-08 来自 CISA KEV JSON。靶场只在宿主回环。

## 9. 修复与后续

- 关闭 DMI，升级 Struts；
- 检测：method: 前缀 + OGNL 标记；
- 未解决：未做交互式命令执行。

## 10. 结论

通过：S2-032 OGNL 执行固定回调命令成功。
