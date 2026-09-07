# 将 hmzz.fun 部署到阿里云 OSS

这是一套纯静态页面，推荐用阿里云对象存储 OSS 托管，无需购买 ECS。

## 0. 先修改个人资料

1. 用文本编辑器打开 `config.js`，修改姓名、邮箱、项目标题、说明与链接。
2. 打开 `index.html`，修改首页简介和“关于”段落。
3. 双击 `index.html` 在本机确认内容。

## 1. 创建 OSS Bucket

1. 登录阿里云控制台，进入“对象存储 OSS”。
2. 创建 Bucket，名称需全局唯一，例如 `hmzz-fun-site`。
3. 地域选择：
   - 已完成 ICP 备案，主要服务中国内地访客：选杭州、上海等中国内地地域。
   - 尚未备案、希望先上线：选中国香港或其他中国内地以外地域。
4. 读写权限创建时可保持“私有”；稍后按第 3 步调整。

## 2. 上传网站文件

进入 Bucket 的“文件管理”，把下列文件上传到 Bucket 根目录（不要再套一层文件夹）：

```text
index.html
404.html
styles.css
config.js
app.js
```

## 3. 开启静态网站托管

1. 在 Bucket 左侧进入“数据管理 > 静态页面”（控制台名称可能显示为“静态网站托管”）。
2. 默认首页填写 `index.html`。
3. 默认 404 页填写 `404.html`，响应码选择 `404`。
4. 在“权限控制 > 阻止公共访问”中关闭阻止公共访问；按控制台提示确认。
5. 在“权限控制 > 读写权限”中将 Bucket ACL 设置为“公共读”。

这个 Bucket 只能放网站公开文件，绝对不要放身份证、密钥、私人照片等敏感资料。

## 4. 绑定域名

建议先使用 `www.hmzz.fun`：

1. 在 Bucket 的“Bucket 配置 > 域名管理”中绑定 `www.hmzz.fun`。
2. 进入阿里云“云解析 DNS > 权威解析”，选择 `hmzz.fun`，添加记录。
3. 记录类型选择 `CNAME`，主机记录填写 `www`。
4. 记录值填写 OSS 域名管理页面给出的目标域名，TTL 保持默认。
5. 等待解析生效后访问 `http://www.hmzz.fun`。

要让裸域名 `hmzz.fun` 也能访问，可再将它绑定到同一 Bucket，并按 OSS 控制台给出的目标添加主机记录为 `@` 的 CNAME。若 `@` 已有 A、AAAA、MX 或其他冲突记录，先确认这些记录是否仍在使用，不要直接删除；也可以在云解析中把裸域名做 301 跳转到 `https://www.hmzz.fun`。

## 5. 配置 HTTPS

1. 在阿里云“数字证书管理服务”申请覆盖 `hmzz.fun` 与 `www.hmzz.fun` 的证书。
2. 回到 OSS 的域名管理，为已绑定域名开启“证书托管/HTTPS”，选择该证书。
3. 需要强制 HTTP 跳转 HTTPS 时，推荐接入阿里云 CDN，然后在 CDN 的 HTTPS 配置中开启强制跳转。

## ICP 备案提示

- Bucket 位于中国内地：绑定自定义域名之前必须完成 ICP 备案。
- Bucket 位于中国香港或海外：通常可先上线，无需中国内地 ICP 备案，但中国内地访问速度可能较慢。

## 以后更新

修改本地文件后，在 OSS 中上传同名文件并选择覆盖。若启用了 CDN，还需要在 CDN 控制台刷新对应 URL 或目录缓存，否则短时间内可能仍显示旧版本。

## 官方文档

- https://help.aliyun.com/zh/oss/user-guide/hosting-static-websites
- https://help.aliyun.com/zh/oss/user-guide/access-buckets-via-custom-domain-names
- https://help.aliyun.com/zh/icp-filing/basic-icp-service/product-overview/use-oss
