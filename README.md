# Jimmy's Page!

复古 GeoCities 风格生日主页，1:1 还原自 Figma 设计稿。

## 目录结构

```
jimmy-page/
├── index.html
├── style.css
├── script.js
├── assets/
│   ├── bg-food.jpg          ← 占位图，需替换为背景照片
│   ├── welcome-mountain.jpg ← 占位图，"Welcome to my little Brain"那张图
│   ├── sticker-welcome-bear.png ← 占位图，右上角说话熊贴纸
│   ├── photo-jimmy.jpg      ← 占位图，绿框人物照片
│   ├── sticker-stamp.png    ← 占位图，左下角"组 1 1"贴纸
│   ├── sticker-bdayhat.png  ← 占位图，生日帽贴纸
│   ├── sticker-pobox.png    ← 占位图，邮筒贴纸
│   └── fonts/               ← 放 Times Newer Roman 字体文件（可选）
└── README.md
```

## 替换真实图片

现在 `assets/` 里全是灰色占位图（带文件名标注，方便对应）。把 Figma 里导出的真实图片，按**同样的文件名**放进 `assets/` 文件夹覆盖掉就行，不用改代码。

导出方法：在 Figma 里选中对应图层 → 右键 → **Export** → 选 PNG/JPG → 导出到本地，改成上面表格里对应的文件名。

## 关于字体

- `Comic Sans MS` / `Times New Roman` 是系统自带字体，大部分电脑都有，不用额外处理
- `VT323` 已经通过 Google Fonts 引入，不用做任何事
- `Times Newer Roman` 不是系统字体也不在 Google Fonts 里，目前用 Georgia/Times New Roman 做了近似替代（视觉上八九不离十）。如果想要 100% 还原：
  1. 去 https://timesnewerroman.com/download.html 下载字体文件
  2. 转换成 `.woff2` 格式（可以用 https://cloudconvert.com/ttf-to-woff2 免费转换）
  3. 把文件重命名为 `TimesNewerRoman-Bold.woff2`，放进 `assets/fonts/` 文件夹
  4. 完成，`style.css` 里已经写好了对应的 `@font-face`，会自动生效

## 部署到 GitHub + Netlify（免费）

### 第一步：传到 GitHub

1. 去 https://github.com 新建一个仓库（New repository），比如叫 `jimmy-birthday-page`，不用勾选任何初始化选项
2. 在这个 `jimmy-page` 文件夹里打开终端，依次执行：

```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/你的用户名/jimmy-birthday-page.git
git push -u origin main
```

（如果没装过 git 或者不熟悉命令行，也可以直接在 GitHub 网页上点 "uploading an existing file"，把这几个文件和 assets 文件夹整个拖进去上传）

### 第二步：连接 Netlify

1. 去 https://app.netlify.com 用 GitHub 账号登录
2. 点 **Add new site → Import an existing project**
3. 选 GitHub，授权后选中你刚才建的仓库
4. 部署设置全部保持默认（不需要 build command，Publish directory 留空或填 `/` 即可，因为这是纯静态 HTML）
5. 点 **Deploy**，一两分钟后 Netlify 会给你一个类似 `https://random-name-123.netlify.app` 的免费网址

### 之后更新内容

以后想改内容（比如换照片、改文字），改完文件后在本地执行：

```bash
git add .
git commit -m "update"
git push
```

Netlify 会自动检测到 GitHub 仓库更新并重新部署，几十秒后网站就是最新的了，不用再手动操作 Netlify 那边。

## 关于响应式

这个设计稿是按 1728px 宽的桌面视图做的，`script.js` 里做了等比缩放处理，在手机上打开会整体缩小显示（保持设计不变形），不会变成上下堆叠的移动端布局。如果之后想要手机上有单独的排版，需要另外做一套移动端样式，跟我说一声我可以加。
