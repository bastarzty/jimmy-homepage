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

## 订阅弹窗接入 Kit（发早鸟折扣/活动通知用）

点击 "Subscribe Me"（导航栏、手机版菜单、还有通知框里的 "subscribe" 文字）会弹出订阅弹窗，收集邮箱。要让它真的能收邮箱、以后能群发早鸟折扣通知，需要接一个免费的 Kit 账号：

1. 去 https://kit.com 免费注册一个账号（原名 ConvertKit）
2. 登录后左侧菜单找 **Grow → Landing Pages & Forms**
3. 点 **Create New → Form**，选一个简单样式（哪怕跟我们做的完全不一样也没关系，样式我们不用，只要拿到表单ID）
4. 表单建好后，点右上角 **Embed**，会看到一段类似这样的代码：
   ```html
   <form action="https://app.kit.com/forms/1234567/subscriptions" method="post">
   ```
5. 把这串数字（比如 `1234567`）复制下来
6. 当前页面已经接入 Kit 表单 ID `9721444`。如果以后换表单，打开 `index.html`，把 `https://app.kit.com/forms/9721444/subscriptions` 里的数字替换成新的表单 ID 即可。

当前表单地址提交后会进到你的 Kit 联系人列表里。之后11月活动通知/早鸟折扣，直接在 Kit 后台 **Broadcasts** 里写一封邮件群发给所有订阅者就行。

注意：提交表单后，浏览器会跳转到 Kit 自带的一个确认页面（默认样式比较朴素）。如果想让这个确认页也保持复古风格，可以在 Kit 后台的表单设置里，把 "Success message" 或者跳转链接改成自定义内容，这个后续需要的话我可以帮你一起弄。



## 2025 Archive 页面

`archive.html` 是明信片墙页面，目前放了你测试的65张（`assets/archive/card-001.png` ~ `card-065.png`）。逻辑是：

- 打开是瀑布流墙，每次刷新顺序随机打乱
- 点开一张，进入大图详情页，右边是"继续看看"的小格子墙（可以一直点下去逛）
- 详情页有点赞（❤️变红+计数）和分享（下载照片 / 分享这张的专属链接）
- 分享出去的链接（形如 `archive.html?card=037`）打开后会直接跳到那一张的详情页，不用重新翻找

### 以后凑齐180张之后怎么加

1. 把新照片按 `card-066.png`、`card-067.png`……这样接着编号，放进 `assets/archive/` 文件夹（要求：文件名三位数字，比如 `card-100.png`，格式统一用 png）
2. 打开 `archive.js`，把最上面的 `const TOTAL_CARDS = 65;` 改成 `180`
3. 保存、推送，齐活

### 接入 Supabase（让点赞数真正存起来、所有人看到一样的数字）

现在点赞是"假的"——每个人看到的赞数只在自己这次打开页面时临时算，刷新就没了。要让它变成真实、所有人共享的数字：

1. 去 https://supabase.com 免费注册一个账号，新建一个项目（Project）
2. 项目建好后，左侧菜单点 **SQL Editor**，新建一个 Query，把项目里 `supabase-setup.sql` 这个文件的全部内容粘贴进去，点 **Run** 执行一次（这一步是在数据库里建表和写好加一逻辑）
3. 左侧菜单点 **Project Settings → API**，找到两个值：
   - **Project URL**（形如 `https://xxxxx.supabase.co`）
   - **anon public** 这一栏的 key（一长串字符）
4. 打开 `archive.js`，把最上面这两行换成你自己的：
   ```js
   const SUPABASE_URL = 'REPLACE_WITH_YOUR_SUPABASE_URL';
   const SUPABASE_ANON_KEY = 'REPLACE_WITH_YOUR_SUPABASE_ANON_KEY';
   ```
5. 保存、推送。之后点赞就是真实存到 Supabase 数据库里的了，任何人打开页面看到的都是同一个数字



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
