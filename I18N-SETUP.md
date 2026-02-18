# Vue I18n 汉化集成总结

## 完成的工作

### 1. 安装的依赖
```bash
npm install vue-i18n@9
```

### 2. 创建的文件

#### `plugins/i18n.ts` - Vue I18n 插件配置
```typescript
import { createI18n } from 'vue-i18n'
import zhCN from '~/locales/zh-CN.json'
import enUS from '~/locales/en-US.json'

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    legacy: true, // 使用 legacy 模式以兼容 $t
    globalInjection: true,
    locale: 'zh-CN',
    fallbackLocale: 'en-US',
    messages: {
      'zh-CN': zhCN,
      'en-US': enUS
    }
  })

  vueApp.use(i18n)

  // 兼容原有的 $t 全局函数
  globalThis.$t = (key: string, params?: Record<string, any>) => {
    return (i18n.global as any).t(key, params)
  }
})
```

#### `locales/zh-CN.json` - 中文翻译
包含 127+ 条翻译，分类：
- `time_*` - 时间相关
- `common.*` - 通用文本
- `editor.*` - 编辑器术语
- `messages.*` - 消息提示
- `ui.*` - UI 元素
- `actions.*` - 操作按钮
- `shortcuts.*` - 快捷键
- `validation.*` - 验证错误
- `fileTypes.*` - 文件类型

#### `locales/en-US.json` - 英文翻译

#### `scripts/extract-texts.js` - 文本提取工具
自动从项目中提取所有需要翻译的英文文本。

### 3. 修改的文件

#### `nuxt.config.ts`
- 添加了 `~/plugins/i18n.ts` 插件

## 使用方法

### 现有代码无需修改！

由于使用了 legacy 模式并保留了全局 `$t` 函数，所有现有的 `$t()` 调用都可以正常工作。

```typescript
// util.ts 中的代码现在可以正常工作
$t("time_years")
$t("time_ago", { amount: 5, unit: $t("time_minute") })
```

### 在 Vue 组件中使用

```vue
<template>
  <button>{{ $t('common.save') }}</button>
  <p>{{ $t('time_ago', { amount: 5, unit: $t('time_minute') }) }}</p>
</template>
```

## 添加新翻译

1. 在 `locales/zh-CN.json` 和 `locales/en-US.json` 中添加对应的翻译
2. 保持两个文件的键名一致

```json
{
  "myModule": {
    "title": "我的模块",
    "description": "这是一个示例模块"
  }
}
```

## 运行和测试

```bash
# 开发模式
npm run dev

# 构建
npm run build

# 提取待翻译文本
node scripts/extract-texts.js
```

## 翻译覆盖率

- ✅ `time_*` - 时间相关（已完成）
- ✅ `common.*` - 通用文本（已完成）
- ✅ `editor.*` - 编辑器术语（已完成）
- ✅ `messages.*` - 消息提示（已完成）
- ✅ `ui.*` - UI 元素（已完成）
- ✅ `actions.*` - 操作（已完成）
- ✅ `shortcuts.*` - 快捷键（已完成）
- ✅ `validation.*` - 验证错误（已完成）
- ✅ `fileTypes.*` - 文件类型（已完成）
- ⏳ 组件中的硬编码文本（待逐步替换）

## 下一步工作

1. **测试汉化效果**：运行 `npm run dev` 查看汉化效果
2. **完善翻译**：根据 `locales/extracted-texts.json` 添加更多翻译
3. **替换硬编码文本**：逐步将组件中的英文文本改为 `$t()` 调用

## 注意事项

1. **Legacy 模式**：使用 legacy 模式是为了兼容原有的 `$t` 调用
2. **全局 `$t`**：`globalThis.$t` 已定义，可在任何地方使用
3. **构建验证**：每次修改后运行 `npm run build` 确保构建成功

## 参考文档

- `I18N-GUIDE.md` - 详细使用指南
- [Vue I18n 文档](https://vue-i18n.intlify.dev/)
