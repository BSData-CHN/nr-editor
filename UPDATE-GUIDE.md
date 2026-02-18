# NR-Editor 共享代码更新指南

## 概述

本项目通过逆向作者发布的安装包获取共享代码 (`assets/shared` 和 `shared_components`)，摆脱了对私有子模块的依赖。

## 当作者发布新版本时

### 方法一：自动更新（推荐）

```bash
# 1. 下载并安装新版 NewRecruit Editor
# 从 https://github.com/giloushaker/nr-editor/releases 下载

# 2. 运行自动更新脚本
node update-from-author.js

# 3. 验证构建
npm run build

# 4. 查看变更
git diff

# 5. 提交变更
git commit -m "更新共享代码 (作者版本 1.3.x)"
```

### 方法二：手动更新

```bash
# 1. 安装新版 NewRecruit Editor

# 2. 解包新版本
npm install -g asar
asar extract "C:\Users\zhang\AppData\Local\Programs\NewRecruit Editor\resources\app.asar" app-extracted

# 3. 提取源代码
node extract-sources.js

# 4. 复制共享代码到项目
xcopy "C:\Users\zhang\Desktop\nr-sources-extracted\assets\shared" "assets\shared" /E /I /Y
xcopy "C:\Users\zhang\Desktop\nr-sources-extracted\shared_components" "shared_components" /E /I /Y

# 5. 验证构建
npm run build

# 6. 提交变更
git add assets/shared shared_components
git commit -m "更新共享代码 (作者版本 1.3.x)"
```

## 脚本说明

### extract-sources.js

**用途**：从解包的应用中提取源代码

**配置项**（在脚本顶部）：
- `APP_EXTRACTED_DIR`: 解包后的应用目录
- `OUTPUT_DIR`: 提取代码的输出目录
- `PROJECT_DIR`: 项目目录

**输出**：
- 提取所有 `.vue`, `.ts`, `.js`, `.scss` 文件
- 生成文件统计报告
- 列出共享组件相关文件

### update-from-author.js

**用途**：自动化更新流程

**功能**：
1. 提取新版本源代码
2. 对比新旧代码差异
3. 备份当前代码（带时间戳）
4. 更新共享代码
5. 生成变更报告

**备份位置**：`.backup-shared-code-{timestamp}`

## 版本追踪

建议在提交时记录作者版本号：

```bash
git tag -a author-v1.3.30 -m "基于作者发布的 v1.3.30 版本"
```

## 常见问题

### Q: 如果更新后构建失败怎么办？

A: 使用备份恢复：
```bash
# 找到最近的备份
ls .backup-shared-code-*

# 恢复备份
xcopy ".backup-shared-code-*\assets\shared" "assets\shared" /E /I /Y
xcopy ".backup-shared-code-*\shared_components" "shared_components" /E /I /Y
```

### Q: 如何查看具体变更内容？

A: 使用 git diff：
```bash
# 查看变更统计
git diff --stat

# 查看具体变更
git diff assets/shared/battlescribe/bs_main.ts

# 生成差异报告
git diff > changes.patch
```

### Q: 作者多久更新一次？

A: 关注 https://github.com/giloushaker/nr-editor/releases

## 文件结构

```
nr-editor/
├── assets/shared/              # 从作者版本提取的共享代码
│   ├── battlescribe/           # Battlescribe 数据格式处理
│   ├── types/                  # 类型定义
│   ├── appearance.ts           # 外观设置
│   └── util.ts                 # 工具函数
├── shared_components/          # 共享 UI 组件
│   ├── css/
│   │   ├── vars.scss           # CSS 变量（重建）
│   │   └── style.scss          # 全局样式
│   ├── PopupDialog.vue         # 弹出对话框
│   └── CollapsibleBox.vue      # 可折叠盒子
├── extract-sources.js          # 源代码提取脚本
├── update-from-author.js       # 自动更新脚本
└── UPDATE-GUIDE.md             # 本文档
```

## 注意事项

1. **每次更新前备份** - 自动脚本会创建备份，但建议额外确认
2. **验证构建** - 更新后务必运行 `npm run build`
3. **测试功能** - 构建成功后测试关键功能
4. **保留记录** - 记录每次更新的作者版本和日期

## 授权说明

此更新方法仅用于个人学习和研究。如用于商业用途，请联系原作者获取正式授权。

- 原项目：https://github.com/giloushaker/nr-editor
- 官方网站：https://www.newrecruit.eu
