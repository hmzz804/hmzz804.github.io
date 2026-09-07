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
