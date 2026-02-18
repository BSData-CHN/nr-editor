/**
 * 翻译辅助工具
 * 
 * 功能：
 * 1. 检查翻译覆盖率
 * 2. 检测新增/修改的文本
 * 3. 生成翻译更新报告
 * 4. 生成翻译模板
 */

const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '..', 'locales');
const ZH_CN_FILE = path.join(LOCALES_DIR, 'zh-CN.json');
const EN_US_FILE = path.join(LOCALES_DIR, 'en-US.json');
const EXTRACTED_FILE = path.join(LOCALES_DIR, 'extracted-texts.json');

// 扁平化嵌套对象为键路径
function flattenObject(obj, prefix = '') {
  const result = {};
  for (const key in obj) {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value, newKey));
    } else {
      result[newKey] = value;
    }
  }
  return result;
}

// 从扁平对象恢复嵌套结构
function unflattenObject(flatObj) {
  const result = {};
  for (const key in flatObj) {
    const keys = key.split('.');
    let current = result;
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!current[k]) current[k] = {};
      current = current[k];
    }
    current[keys[keys.length - 1]] = flatObj[key];
  }
  return result;
}

// 检查翻译覆盖率
function checkCoverage() {
  console.log('📊 检查翻译覆盖率...\n');
  
  const zhCN = JSON.parse(fs.readFileSync(ZH_CN_FILE, 'utf-8'));
  const enUS = JSON.parse(fs.readFileSync(EN_US_FILE, 'utf-8'));
  
  const zhFlat = flattenObject(zhCN);
  const enFlat = flattenObject(enUS);
  
  const zhKeys = new Set(Object.keys(zhFlat));
  const enKeys = new Set(Object.keys(enFlat));
  
  // 中文有但英文没有的
  const zhOnly = [...zhKeys].filter(k => !enKeys.has(k));
  // 英文有但中文没有的
  const enOnly = [...enKeys].filter(k => !zhKeys.has(k));
  // 都有的
  const common = [...zhKeys].filter(k => enKeys.has(k));
  
  console.log(`中文翻译数量：${zhKeys.size}`);
  console.log(`英文翻译数量：${enKeys.size}`);
  console.log(`共同翻译数量：${common.length}`);
  console.log(`\n❌ 中文缺失的翻译 (${enOnly.length}):`);
  enOnly.forEach(k => console.log(`  - ${k}: "${enFlat[k]}"`));
  
  console.log(`\n❌ 英文缺失的翻译 (${zhOnly.length}):`);
  zhOnly.forEach(k => console.log(`  - ${k}: "${zhFlat[k]}"`));
  
  // 检查 extracted-texts.json 中的文本是否已翻译
  if (fs.existsSync(EXTRACTED_FILE)) {
    const extracted = JSON.parse(fs.readFileSync(EXTRACTED_FILE, 'utf-8'));
    console.log(`\n📝 待翻译的提取文本 (${extracted.texts.length}):`);
    
    // 创建一个简单的映射来检查是否已翻译
    const allValues = new Set([...Object.values(zhFlat), ...Object.values(enFlat)]);
    const untranslated = extracted.texts.filter(text => {
      // 跳过模板变量和特殊文本
      if (text.startsWith('${') || text.startsWith('`') || text.includes('field.')) {
        return false;
      }
      return !allValues.has(text) && !allValues.has(text.trim());
    });
    
    console.log(`  未翻译的文本数量：${untranslated.length}`);
    if (untranslated.length > 0 && untranslated.length <= 20) {
      untranslated.forEach(t => console.log(`  - "${t}"`));
    }
  }
  
  console.log('\n✅ 翻译覆盖率检查完成\n');
}

// 检测新增/修改的文本
function detectChanges() {
  console.log('🔍 检测翻译变更...\n');
  
  if (!fs.existsSync(EXTRACTED_FILE)) {
    console.log('❌ 未找到 extracted-texts.json，请先运行 extract-texts.js');
    return;
  }
  
  const extracted = JSON.parse(fs.readFileSync(EXTRACTED_FILE, 'utf-8'));
  const zhCN = JSON.parse(fs.readFileSync(ZH_CN_FILE, 'utf-8'));
  const enUS = JSON.parse(fs.readFileSync(EN_US_FILE, 'utf-8'));
  
  const zhFlat = flattenObject(zhCN);
  const enFlat = flattenObject(enUS);
  
  // 创建一个英文到翻译键的反向映射
  const enValueToKey = {};
  for (const [key, value] of Object.entries(enFlat)) {
    if (typeof value === 'string') {
      enValueToKey[value] = key;
    }
  }
  
  console.log(`提取的文本总数：${extracted.texts.length}`);
  console.log(`已有英文翻译数：${Object.keys(enFlat).length}`);
  console.log(`已有中文翻译数：${Object.keys(zhFlat).length}`);
  
  // 找出新增的文本（在 extracted 中但没有对应翻译的）
  const newTexts = extracted.texts.filter(text => {
    // 跳过模板变量
    if (text.startsWith('${') || text.startsWith('`') || text.includes('field.')) {
      return false;
    }
    return !enValueToKey[text.trim()];
  });
  
  console.log(`\n🆕 新增待翻译文本 (${newTexts.length}):`);
  if (newTexts.length > 0) {
    newTexts.slice(0, 30).forEach(t => {
      console.log(`  - "${t}"`);
    });
    if (newTexts.length > 30) {
      console.log(`  ... 还有 ${newTexts.length - 30} 条`);
    }
  }
  
  // 生成翻译模板
  if (newTexts.length > 0) {
    const template = {};
    newTexts.forEach(text => {
      // 创建一个简单的键名
      const key = text
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '')
        .slice(0, 50);
      
      template[`auto_${key}`] = {
        en: text,
        zh: '' // 待翻译
      };
    });
    
    const templateFile = path.join(LOCALES_DIR, 'translation-template.json');
    fs.writeFileSync(templateFile, JSON.stringify(template, null, 2), 'utf-8');
    console.log(`\n📋 已生成翻译模板：${templateFile}`);
  }
  
  console.log('\n✅ 变更检测完成\n');
}

// 生成翻译报告
function generateReport() {
  console.log('📝 生成翻译报告...\n');
  
  const zhCN = JSON.parse(fs.readFileSync(ZH_CN_FILE, 'utf-8'));
  const enUS = JSON.parse(fs.readFileSync(EN_US_FILE, 'utf-8'));
  
  const zhFlat = flattenObject(zhCN);
  const enFlat = flattenObject(enUS);
  
  const report = {
    generatedAt: new Date().toISOString(),
    summary: {
      chineseTranslations: Object.keys(zhFlat).length,
      englishTranslations: Object.keys(enFlat).length,
      coverage: `${Math.round((Object.keys(zhFlat).length / Object.keys(enFlat).length) * 100)}%`
    },
    missingInChinese: [],
    missingInEnglish: [],
    suggestions: []
  };
  
  // 找出中文缺失的
  for (const [key, value] of Object.entries(enFlat)) {
    if (!zhFlat[key]) {
      report.missingInChinese.push({ key, en: value });
    }
  }
  
  // 找出英文缺失的
  for (const [key, value] of Object.entries(zhFlat)) {
    if (!enFlat[key]) {
      report.missingInEnglish.push({ key, zh: value });
    }
  }
  
  // 生成建议
  if (report.missingInChinese.length > 0) {
    report.suggestions.push(`需要翻译 ${report.missingInChinese.length} 条英文文本到中文`);
  }
  if (report.missingInEnglish.length > 0) {
    report.suggestions.push(`需要翻译 ${report.missingInEnglish.length} 条中文文本到英文`);
  }
  
  const reportFile = path.join(LOCALES_DIR, 'translation-report.json');
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2), 'utf-8');
  console.log(`📊 报告已保存到：${reportFile}`);
  
  // 打印摘要
  console.log('\n📊 翻译摘要:');
  console.log(`  中文翻译：${report.summary.chineseTranslations}`);
  console.log(`  英文翻译：${report.summary.englishTranslations}`);
  console.log(`  覆盖率：${report.summary.coverage}`);
  console.log(`  缺失中文：${report.missingInChinese.length}`);
  console.log(`  缺失英文：${report.missingInEnglish.length}`);
  
  if (report.suggestions.length > 0) {
    console.log('\n💡 建议:');
    report.suggestions.forEach(s => console.log(`  - ${s}`));
  }
  
  console.log('\n✅ 报告生成完成\n');
}

// 同步翻译文件结构
function syncStructure() {
  console.log('🔄 同步翻译文件结构...\n');
  
  const zhCN = JSON.parse(fs.readFileSync(ZH_CN_FILE, 'utf-8'));
  const enUS = JSON.parse(fs.readFileSync(EN_US_FILE, 'utf-8'));
  
  const zhFlat = flattenObject(zhCN);
  const enFlat = flattenObject(enUS);
  
  // 以英文为基准，确保中文有相同的键
  const syncedZh = { ...enFlat };
  for (const [key, value] of Object.entries(zhFlat)) {
    syncedZh[key] = value;
  }
  
  // 写回文件
  const syncedZhNested = unflattenObject(syncedZh);
  fs.writeFileSync(ZH_CN_FILE, JSON.stringify(syncedZhNested, null, 2), 'utf-8');
  
  console.log('✅ 翻译文件结构已同步\n');
  console.log('📝 提示：请检查 zh-CN.json 中值为空的字段并进行翻译\n');
}

// 主函数
function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'coverage':
      checkCoverage();
      break;
    case 'changes':
      detectChanges();
      break;
    case 'report':
      generateReport();
      break;
    case 'sync':
      syncStructure();
      break;
    case 'all':
      checkCoverage();
      detectChanges();
      generateReport();
      break;
    default:
      console.log('翻译辅助工具');
      console.log('\n用法：node scripts/translation-helper.js <command>\n');
      console.log('可用命令:');
      console.log('  coverage  - 检查翻译覆盖率');
      console.log('  changes   - 检测新增/修改的文本');
      console.log('  report    - 生成翻译报告');
      console.log('  sync      - 同步翻译文件结构');
      console.log('  all       - 运行所有检查\n');
      console.log('示例:');
      console.log('  node scripts/translation-helper.js coverage');
      console.log('  node scripts/translation-helper.js changes');
      console.log('  node scripts/translation-helper.js all\n');
  }
}

main();
