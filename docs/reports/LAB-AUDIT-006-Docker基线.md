# 实验报告：LAB-AUDIT-006 Docker 安全基线检查

## 文档控制

| 项 | 值 |
|---|---|
| 编号 | LAB-AUDIT-006 |
| 日期 | 2026-10-25 |
| 执行 | lead（AI） |
| 分类 | 配置审计 |
| 风险级别 | 低 |
| 状态 | 完成 |

## 1. 目标

检查 lab-linux 的 Docker daemon 暴露面与默认安全选项。

## 2. 范围与环境

- lab-linux，Docker 26.1.5；
- 只读检查，不改配置。

## 3. 假设

H1：socket 不应全局可写；H2：不应监听 2375/2376 明文端口。

## 4. 步骤

1. ls -l /var/run/docker.sock；
2. ss -ltnp 查 2375/2376；
3. docker info 看 SecurityOptions。

## 5. 结果

| 检查项 | 实际 | 结论 |
|---|---|---|
| socket 权限 | srw-rw---- root:docker | 通过 |
| 2375/2376 | 未监听 | 通过 |
| 安全选项 | apparmor、seccomp builtin、cgroupns | 记录 |

## 6. 证据

- 证据文件：data/security/experiments/LAB-AUDIT-006/evidence.txt。

## 7. 分析

事实：socket 仅 root/docker 组可读写，无明文 TCP 监听，AppArmor/seccomp 生效。推断：只要 docker 组不扩大给普通用户，暴露面可控；容器仍共享内核，需注意特权容器。

## 8. 风险与影响

能进 docker 组等于 root；当前无远程 daemon 暴露。

## 9. 修复与后续

- 定期检查组成员；
- 禁止 --privileged 和宿主目录挂载；
- 未解决：未做容器逃逸测试。

## 10. 结论

通过：socket 权限与端口暴露符合基线。
