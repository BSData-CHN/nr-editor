/**
 * 提取项目中所有需要翻译的文本
 * 用于生成完整的翻译文件
 */

const fs = require('fs');
const path = require('path');

// 配置
const PROJECT_DIR = path.join(__dirname, '..');
const OUTPUT_FILE = path.join(__dirname, '../locales/extracted-texts.json');

// 要扫描的文件扩展名
const EXTENSIONS = ['.vue', '.ts', '.js'];

// 要忽略的目录
const IGNORE_DIRS = ['node_modules', '.git', '.nuxt', '.output', 'dist', 'dist-electron'];

// 存储提取的文本
const extractedTexts = new Set();

// 匹配英文文本的正则
const TEXT_PATTERNS = [
  // Vue 模板中的文本
  />([A-Za-z][A-Za-z0-9\s\.,!?'-]{3,100})</g,
  // v-text 或 {{ }} 中的文本（跳过变量）
  /v-text="([^"{}/\s]{3,50})"/g,
  // placeholder 属性
  /placeholder="([^"]{3,100})"/g,
  // title 属性
  /title="([^"]{3,100})"/g,
  // label 标签内容
  /<label[^>]*>([^<]{3,100})<\/label>/g,
  // button 标签内容
  /<button[^>]*>([^<]{3,100})<\/button>/g,
  // 字符串字面量（用于 $t 调用）
  /\$t\(["']([^"']+)["']\)/g,
];

function shouldIgnore(dir) {
  return IGNORE_DIRS.some(ignore => dir.includes(ignore));
}

function extractTextsFromFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const relativePath = path.relative(PROJECT_DIR, filePath);
  
  for (const pattern of TEXT_PATTERNS) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const text = match[1].trim();
      // 过滤掉纯 HTML、变量名、路径等
      if (text && 
          !text.startsWith('{') && 
          !text.startsWith('/') &&
          !text.includes('://') &&
          !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(text) &&
          text.length >= 3 && text.length <= 200) {
        extractedTexts.add(text);
      }
    }
  }
  
  console.log(`已扫描：${relativePath}`);
}

function scanDirectory(dir) {
  if (shouldIgnore(dir)) return;
  
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      scanDirectory(filePath);
    } else if (EXTENSIONS.includes(path.extname(file))) {
      extractTextsFromFile(filePath);
    }
  }
}

function main() {
  console.log('开始提取文本...\n');
  scanDirectory(PROJECT_DIR);
  
  // 转换为对象格式
  const result = {
    extractedAt: new Date().toISOString(),
    total: extractedTexts.size,
    texts: [...extractedTexts].sort()
  };
  
  // 保存到文件
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2), 'utf-8');
  
  console.log(`\n提取完成！`);
  console.log(`共提取 ${result.total} 条文本`);
  console.log(`结果已保存到：${OUTPUT_FILE}`);
}

main();
