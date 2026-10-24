# 反射型 XSS：/xss?name= 原样回显

- 对象：自建训练靶场 lab/webapp（非真实产品）
- 类型：训练用自建代码，不是真实产品漏洞
- 复现：`GET /xss?name=<script>alert(1)</script>`
- 证据：`<p>hello <script>alert(1)</script></p>`
- 影响：脚本在受害者浏览器执行，可窃取会话/发起操作
- 修复：输出编码；CSP
- 置信度：高（本地可重复）
- 备注：仅用于本地靶场教学；不针对任何第三方系统。
