# hmzz.fun

一个零依赖、可直接部署的静态个人网站。

## 本地预览

直接双击 `index.html` 即可，或在目录中运行：

```powershell
python -m http.server 8000
```

然后访问 `http://localhost:8000`。

## 修改内容

- 姓名、邮箱与项目列表：编辑 `config.js`
- 标题、简介、关于文字：编辑 `index.html`
- 颜色与版式：编辑 `styles.css` 顶部的 CSS 变量

## 部署

将 `index.html`、`styles.css`、`config.js`、`app.js` 上传到任意静态网站空间的根目录即可。

使用阿里云 OSS 与 `hmzz.fun` 的完整操作说明见 `DEPLOY.md`。

## 访问统计

网站支持 Cloudflare Web Analytics。它不要求把域名 DNS 转移到 Cloudflare，也不会在本地预览时上报数据。

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)，进入 `Web Analytics`。
2. 选择 `Add a site`，主机名填写 `hmzz.fun`。
3. 创建后进入 `Manage site`，复制代码片段中的站点 Token。
4. 打开 `config.js`，将 Token 填入 `analytics.cloudflareToken`。
5. 提交并推送后，访问一次线上网站；数据通常会在几分钟后出现。

可在 Cloudflare 后台查看页面访问量、独立访客、访问来源、国家或地区、浏览器、操作系统和页面性能。站点 Token 是公开的网站标识，不是账户密钥。
