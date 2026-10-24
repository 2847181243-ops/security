# 路径穿越：/file?name=../server.mjs 读到源码

- 对象：自建训练靶场 lab/webapp（非真实产品）
- 类型：训练用自建代码，不是真实产品漏洞
- 复现：`GET /file?name=../server.mjs`
- 证据：`返回 server.mjs 开头内容`
- 影响：读取预期目录外文件
- 修复：白名单文件名；realpath 校验
- 置信度：高（本地可重复）
- 备注：仅用于本地靶场教学；不针对任何第三方系统。
