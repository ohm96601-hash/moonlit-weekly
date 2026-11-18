# Moonlit Weekly · 月光塔罗任务日程

纯静态 HTML/CSS/JavaScript，适配 iPhone。包括六款塔罗插画、卡片翻面与拖动安排、日周月视图、任务优先级、删除撤销、备份恢复、可定制标题及轻柔抽卡音效。

## 上传 GitHub
1. 创建仓库，例如 moonlit-weekly。私有仓库也可用于 Cloudflare Pages。
2. 解压发布包，把 dist 文件夹、tests 文件夹及本 README 上传至仓库根目录。
3. 根目录下面应有 dist/index.html，不要把整个 ZIP 文件上传作为源码。

## Cloudflare Pages 发布
Workers & Pages → Create application → Pages → Connect to Git。
选择 GitHub 仓库，配置：
- Production branch: main（或实际默认分支）
- Framework preset: None
- Build command: 留空
- Build output directory: dist
- Root directory: 留空
保存部署，成功后获得 pages.dev 网址。后续更新仓库将触发自动发布。

如果界面询问 Worker 部署命令，请返回并选择 Pages。
也可用 Pages 的 Direct Upload 上传 dist 内容，但这不是 Git 自动发布路线。
官方说明：https://developers.cloudflare.com/pages/get-started/git-integration/

## 数据迁移
先在旧网站的设置中导出 JSON 备份，下载保存；新网址打开后再导入。
任务保存在各自浏览器的网站本地存储中，不在 GitHub，也没有跨设备自动同步。
新部署没有 ChatGPT 登录门槛；每位访客使用各自浏览器的独立数据。

## iPhone 主屏幕
Safari 打开新网址 → 分享 → 添加到主屏幕。若从主屏幕打开后没有原数据，导入已保存的备份。

## 验证
运行 node tests/sound.test.cjs。所有 JavaScript 可以用 node --check 检查。

## 版本来源
对应已发布的首页完整标题自定义版本，源码提交 26a745287f70eec6101fbb9f64751e3330204991。
发布包不含当前设备任务数据、原平台配置、Git 历史或访问凭据。
