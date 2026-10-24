# 实验报告：LAB-FUZZ-004 onebot 扩展名解析 fuzz

## 文档控制

| 项 | 值 |
|---|---|
| 编号 | LAB-FUZZ-004 |
| 日期 | 2026-10-25 |
| 执行 | lead（AI） |
| 分类 | 模糊测试 / 真实组件 |
| 风险级别 | 低 |
| 状态 | 完成（基线） |

## 1. 目标

用覆盖率引导 fuzz 测 onebot 生产代码里的 extForUrl 扩展名解析，断言结果始终符合白名单正则。

## 2. 范围与环境

- 目标：dsh-onebot-qq 0.9.6 lib/media.js 的 extForUrl；
- 为绕开 ESM/CJS 与 @napi-rs/canvas 依赖，将 lib 复制为 .mjs，image-shrink 只做无操作 stub（与 extForUrl 无关）；
- Jazzer 10,000 次；只改副本，不动插件本体。

## 3. 假设

H1：任何输入下 extForUrl 都返回 ^\.[a-z0-9]{1,5}$；H2：找不到违规即白名单成立。

## 4. 步骤

1. 复制 lib 到 lab/fuzz/onebot-esm，改 .mjs 与相对 import；
2. 写 exttarget.mjs，构造 URL 后断言扩展名；
3. 跑 npx jazzer exttarget.mjs corpus -- -runs=10000。

## 5. 结果

| 指标 | 实际 |
|---|---|
| 运行次数 | 10,000 |
| 覆盖边 | 12 |
| 语料 | 3 条 / 5 字节 |
| 违规 | 0 |

## 6. 证据

- 证据文件：data/security/experiments/LAB-FUZZ-004/evidence.txt；
- harness：lab/fuzz/exttarget.mjs；
- 副本：lab/fuzz/onebot-esm（含 stub）。

## 7. 分析

事实：10k 次变异没有打破扩展名白名单。推断：extForUrl/extForInboundName 的字符过滤较稳；这只覆盖一个纯函数，不代表媒体下载/SSRF 全链安全。

## 8. 风险与影响

没有违规不等于没有漏洞；路径、DNS、命令执行面未覆盖。

## 9. 修复与后续

- 把 harness 扩到 resolveInner/downloadUrl 的 URL 校验；
- 用真实 canvas 依赖替换 stub 才能测图片链路；
- 未解决：未跑全链。

## 10. 结论

通过：extForUrl 在 10k 次变异下保持白名单，未发现违规。
