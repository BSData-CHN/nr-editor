# I18N 汉化指南

## 快速开始

项目已集成 Vue I18n，默认使用中文。

```bash
# 安装依赖
npm install

# 运行开发服务器
npm run dev
```

## 使用方法

### Vue 组件中
```vue
<template>
  <button>{{ $t('common.save') }}</button>
  <p>{{ $t('time_ago', { amount: 5, unit: $t('time_minute') }) }}</p>
</template>
```

### TypeScript/JavaScript 中
```typescript
// 方式 1: 全局 $t
const msg = $t('common.save')

// 方式 2: useI18n
const { t } = useI18n()
const msg = t('common.save')
```

## 添加翻译

在 `locales/zh-CN.json` 和 `locales/en-US.json` 中添加：

```json
{
  "myModule": {
    "title": "我的模块"
  }
}
```

## 翻译脚本

### 提取待翻译文本
```bash
node scripts/extract-texts.js
```
扫描项目提取英文文本到 `locales/extracted-texts.json`

### 翻译辅助工具
```bash
# 检查覆盖率
node scripts/translation-helper.js coverage

# 检测新增文本
node scripts/translation-helper.js changes

# 生成报告
node scripts/translation-helper.js report

# 同步文件结构
node scripts/translation-helper.js sync

# 运行所有检查
node scripts/translation-helper.js all
```

## 翻译规范

### 通用术语
| 英文 | 中文 |
|------|------|
| Catalogue | 目录 |
| Profile | 档案 |
| Characteristic | 特性 |
| Constraint | 限制 |
| Modifier | 修正 |

### 命名规范
- 使用 `common.save` 而非 `text1`
- 按模块分组：`editor.catalogue`
- 参数化：`"time_ago": "{amount}{unit}前"`

## 文件结构

```
locales/
├── zh-CN.json              # 中文翻译
├── en-US.json              # 英文翻译
├── extracted-texts.json    # 提取的文本（自动生成）
├── translation-template.json # 翻译模板（自动生成）
└── translation-report.json   # 报告（自动生成）
```
