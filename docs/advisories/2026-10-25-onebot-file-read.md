# Advisory（内部/未验证可达）：onebot file:// 媒体 ref 任意文件复制

## 基本信息

- 组件：dsh-onebot-qq 0.9.6
- 发现者：lead（AI）
- 日期：2026-10-25
- 状态：动态确认本地复制；能否由 QQ 消息触发未验证

## 问题

lib/media.js 的 resolveInner 对 file:// 开头的 ref.file 直接 copyFile(source, media_path)，没有限制源路径在允许目录内。

## 验证

- 用 MediaStore.resolve({kind:'image', file:'file://D:/.../secret-proof.txt'})；
- 返回 resolved=true，媒体目录生成 media_*.jpg，内容为源文件内容；
- 只读自建 proof 文件，未读密钥。

## 影响

若 NapCat 会把消息里的 file 字段原样传给插件，发送者可让 bot 复制本地任意可读文件到媒体目录，再可能被后续发送/读取。可达性未验证。

## 建议修复

- inbound 只接受 NapCat 可信来源的 file 字段；拒绝 file:// 形式；
- 或限制 file:// 源到配置的媒体根目录，做 realpath 前缀校验；
- 不改变 resolveHash 的可信路径。

## 证据

- data/security/experiments/LAB-AUDIT-003/evidence.txt；
- scripts/test_onebot_file_ref.mjs。
