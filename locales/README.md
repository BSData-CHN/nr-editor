# Locales 目录说明

## 文件说明

### 核心翻译文件（需手动维护）
- `zh-CN.json` - 中文翻译
- `en-US.json` - 英文翻译

### 自动生成文件（无需手动编辑）
- `extracted-texts.json` - 从代码提取的英文文本
- `translation-template.json` - 待翻译模板
- `translation-report.json` - 翻译报告

## 生成命令

```bash
# 提取文本
node scripts/extract-texts.js

# 生成模板和报告
node scripts/translation-helper.js all
```

## 注意事项

自动生成的文件每次运行脚本时会被覆盖，请勿手动修改。
