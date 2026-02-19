# I18N 设置摘要

## 已完成的配置

### 依赖
```bash
npm install vue-i18n@9
```

### 关键文件
- `plugins/i18n.ts` - Vue I18n 配置
- `locales/zh-CN.json` - 中文翻译（127+ 条）
- `locales/en-US.json` - 英文翻译

### Nuxt 配置
`nuxt.config.ts` 已加载 `~/plugins/i18n.ts`

## 现有翻译分类

| 分类 | 说明 | 状态 |
|------|------|------|
| `time_*` | 时间相关 | ✅ |
| `common.*` | 通用文本 | ✅ |
| `editor.*` | 编辑器术语 | ✅ |
| `messages.*` | 消息提示 | ✅ |
| `ui.*` | UI 元素 | ✅ |
| `actions.*` | 操作按钮 | ✅ |
| `shortcuts.*` | 快捷键 | ✅ |
| `validation.*` | 验证错误 | ✅ |
| `fileTypes.*` | 文件类型 | ✅ |

## 下一步

1. 运行 `npm run dev` 测试汉化效果
2. 使用 `node scripts/extract-texts.js` 提取更多文本
3. 逐步替换组件中的硬编码英文

详细使用参考 [I18N-GUIDE.md](./I18N-GUIDE.md)
