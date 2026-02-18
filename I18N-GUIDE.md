# NR-Editor 汉化指南

## 概述

本项目已集成 Vue I18n，支持中英文双语。默认语言为中文。

**注意**: 本项目使用 Vue I18n 的 legacy 模式，以保持与原有 `$t()` 调用的兼容性。

## 项目结构

```
nr-editor/
├── locales/                    # 翻译文件目录
│   ├── zh-CN.json             # 中文翻译
│   ├── en-US.json             # 英文翻译
│   └── extracted-texts.json   # 提取的待翻译文本（由脚本生成）
├── i18n.config.ts              # i18n 配置文件（用于参考）
├── plugins/
│   └── i18n.ts                # Vue I18n 插件配置
├── nuxt.config.ts              # Nuxt 配置
└── scripts/
    └── extract-texts.js       # 文本提取脚本
```

## 使用方法

### 1. 在 Vue 组件中使用翻译

```vue
<template>
  <!-- 方式 1: 使用 $t -->
  <button>{{ $t('common.save') }}</button>
  
  <!-- 方式 2: 使用 t 函数 -->
  <div>{{ t('messages.loading') }}</div>
  
  <!-- 带参数的翻译 -->
  <p>{{ $t('time_ago', { amount: 5, unit: $t('time_minute') }) }}</p>
</template>

<script setup>
// 在 script 中使用
const { t } = useI18n()
const message = t('common.success')
</script>
```

### 2. 在 TypeScript/JavaScript 中使用翻译

```typescript
// 方式 1: 使用全局 $t（兼容原有代码）
const message = $t('common.save')

// 方式 2: 使用 i18n 实例
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const message = t('common.save')
```

### 3. 添加新的翻译

1. 在 `locales/zh-CN.json` 和 `locales/en-US.json` 中添加对应的翻译
2. 保持两个文件的键名一致
3. 按照功能模块组织翻译键（如 `common`, `editor`, `messages` 等）

示例：
```json
{
  "myModule": {
    "title": "我的模块",
    "description": "这是一个示例模块"
  }
}
```

## 翻译键命名规范

- 使用小写字母和连字符：`my-key`
- 使用驼峰式也可以：`myKey`
- 按功能模块分组：`module.feature.item`

推荐结构：
```json
{
  "common": { },      // 通用文本
  "editor": { },      // 编辑器相关
  "messages": { },    // 消息提示
  "ui": { },          // UI 元素
  "actions": { },     // 操作按钮
  "validation": { }   // 验证错误
}
```

## 工具脚本

### 提取待翻译文本

```bash
node scripts/extract-texts.js
```

这会扫描项目中的所有 `.vue`, `.ts`, `.js` 文件，提取英文文本到 `locales/extracted-texts.json`。

### 查看翻译覆盖率

检查 `locales/zh-CN.json` 和 `locales/en-US.json` 的键数量，确保两种语言都有对应的翻译。

## 切换语言

目前默认使用中文。如需添加语言切换功能，可以：

1. 在设置页面添加语言选择器
2. 使用 `i18n.locale.value = 'en-US'` 切换语言
3. 将用户选择保存到本地存储

示例：
```vue
<template>
  <select v-model="locale">
    <option value="zh-CN">中文</option>
    <option value="en-US">English</option>
  </select>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

// 从本地存储加载用户偏好
const savedLocale = localStorage.getItem('locale') || 'zh-CN'
locale.value = savedLocale

// 保存用户选择
watch(locale, (newLocale) => {
  localStorage.setItem('locale', newLocale)
})
</script>
```

## 现有翻译分类

### time_* - 时间相关
- `time_year`, `time_month`, `time_day` 等
- `time_just_now`, `time_ago`

### common.* - 通用文本
- `save`, `cancel`, `delete`, `edit` 等

### editor.* - 编辑器术语
- `catalogue`, `profile`, `characteristics` 等

### messages.* - 消息提示
- `unsavedChanges`, `saveSuccess` 等

### ui.* - UI 元素
- `myCatalogues`, `searchPlaceholder` 等

### actions.* - 操作
- `cut`, `copy`, `paste` 等

### shortcuts.* - 快捷键
- `ctrlX`, `ctrlC`, `ctrlV` 等

### validation.* - 验证错误
- `required`, `invalidFormat` 等

### fileTypes.* - 文件类型
- `gameSystem`, `catalogue`, `json` 等

## 注意事项

1. **保持同步**: 添加新翻译时，确保同时更新 `zh-CN.json` 和 `en-US.json`
2. **参数化**: 对于包含变量的文本，使用参数化翻译：`{variable}`
3. **上下文**: 同一个英文单词在不同上下文可能需要不同翻译
4. **测试**: 修改翻译后，运行 `npm run build` 确保构建成功

## 构建和测试

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 运行
npm run preview
```

## 后续工作

1. 逐步替换组件中的硬编码英文文本
2. 添加语言切换功能
3. 完善翻译覆盖率
4. 考虑添加其他语言支持

## 参考链接

- [Vue I18n 文档](https://vue-i18n.intlify.dev/)
- [Nuxt i18n 模块](https://i18n.nuxtjs.org/)
