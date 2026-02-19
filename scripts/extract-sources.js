/**
 * NR-Editor 源代码提取工具
 * 
 * 用途：从已安装的 NewRecruit Editor 应用中提取源代码
 * 原理：利用构建版本中保留的 source map 文件还原原始代码
 * 
 * 使用方法：
 * 1. 确保已安装 NewRecruit Editor
 * 2. 运行：node extract-sources.js
 * 3. 提取的源代码将保存到指定输出目录
 * 
 * 作者更新后的处理流程：
 * 1. 下载并安装新版本的 NewRecruit Editor
 * 2. 运行此脚本提取新源代码
 * 3. 对比新旧代码差异
 * 4. 将 assets/shared 和 shared_components 的变更合并到项目
 */

const fs = require('fs');
const path = require('path');

// ==================== 配置区域 ====================

// 输入：解包后的应用目录（需要先解包 app.asar）
const APP_EXTRACTED_DIR = "C:/Users/zhang/AppData/Local/Programs/NewRecruit Editor/resources/app-extracted";

// 输出：提取的源代码目录
const OUTPUT_DIR = "C:/Users/zhang/Desktop/nr-sources-extracted";

// 项目目录（用于直接复制）
const PROJECT_DIR = "C:/Users/zhang/WebstormProjects/nr-editor";

// ==================== 主函数 ====================

function main() {
    console.log('='.repeat(60));
    console.log('NR-Editor 源代码提取工具');
    console.log('='.repeat(60));
    
    // 检查输入目录是否存在
    if (!fs.existsSync(APP_EXTRACTED_DIR)) {
        console.error(`错误：找不到解包目录 ${APP_EXTRACTED_DIR}`);
        console.error('请先解包 app.asar 文件：');
        console.error('  npm install -g asar');
        console.error('  asar extract "app.asar" app-extracted');
        process.exit(1);
    }
    
    // 创建输出目录
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        console.log(`创建输出目录：${OUTPUT_DIR}`);
    }
    
    // 查找所有 .js.map 文件
    const mapFiles = findSourceMaps(APP_EXTRACTED_DIR);
    console.log(`\n找到 ${mapFiles.length} 个 source map 文件`);
    
    // 提取所有源代码
    const extractedFiles = new Map();
    
    for (const mapFile of mapFiles) {
        const relativePath = path.relative(APP_EXTRACTED_DIR, path.dirname(mapFile));
        console.log(`\n[${relativePath}] 处理：${path.basename(mapFile)}`);
        
        try {
            const mapContent = JSON.parse(fs.readFileSync(mapFile, 'utf8'));
            
            if (!mapContent.sources || !mapContent.sourcesContent) {
                continue;
            }
            
            for (let i = 0; i < mapContent.sources.length; i++) {
                const sourcePath = mapContent.sources[i];
                const content = mapContent.sourcesContent[i];
                
                // 跳过空内容
                if (!content) continue;
                
                // 规范化路径（移除 ../../ 前缀）
                const normalizedPath = sourcePath
                    .replace(/\.\.\//g, '')
                    .replace(/\\/g, '/');
                
                // 只处理 Vue/TS/JS/SCSS 文件
                if (!normalizedPath.match(/\.(vue|ts|js|scss|css)$/i)) {
                    continue;
                }
                
                // 创建输出路径
                const outPath = path.join(OUTPUT_DIR, normalizedPath);
                const outDir = path.dirname(outPath);
                
                if (!fs.existsSync(outDir)) {
                    fs.mkdirSync(outDir, { recursive: true });
                }
                
                // 如果已存在相同文件，跳过（避免重复）
                const key = normalizedPath.toLowerCase();
                if (extractedFiles.has(key)) {
                    continue;
                }
                
                fs.writeFileSync(outPath, content, 'utf8');
                extractedFiles.set(key, outPath);
                console.log(`  ✓ 提取：${normalizedPath}`);
            }
        } catch (err) {
            console.error(`  ✗ 错误：${err.message}`);
        }
    }
    
    // 输出统计
    console.log('\n' + '='.repeat(60));
    console.log('提取完成！');
    console.log(`共提取 ${extractedFiles.size} 个文件到：${OUTPUT_DIR}`);
    
    // 分类统计
    const stats = {
        vue: 0,
        ts: 0,
        js: 0,
        scss: 0,
        css: 0
    };
    
    for (const key of extractedFiles.keys()) {
        const ext = path.extname(key).toLowerCase();
        if (stats.hasOwnProperty(ext)) {
            stats[ext]++;
        }
    }
    
    console.log('\n文件类型统计:');
    console.log(`  Vue 组件：${stats.vue} 个`);
    console.log(`  TypeScript: ${stats.ts} 个`);
    console.log(`  JavaScript: ${stats.js} 个`);
    console.log(`  SCSS: ${stats.scss} 个`);
    console.log(`  CSS: ${stats.css} 个`);
    
    // 查找共享组件相关内容
    console.log('\n' + '='.repeat(60));
    console.log('共享组件分析:');
    
    const sharedComponentsFiles = [];
    const assetsSharedFiles = [];
    
    for (const [key, filePath] of extractedFiles) {
        if (key.includes('shared_components')) {
            sharedComponentsFiles.push(filePath);
        }
        if (key.includes('assets/shared')) {
            assetsSharedFiles.push(filePath);
        }
    }
    
    console.log(`\nshared_components (${sharedComponentsFiles.length} 个文件):`);
    sharedComponentsFiles.forEach(f => console.log(`  - ${f}`));
    
    console.log(`\nassets/shared (${assetsSharedFiles.length} 个文件):`);
    assetsSharedFiles.forEach(f => console.log(`  - ${f}`));
    
    // 生成差异报告
    console.log('\n' + '='.repeat(60));
    console.log('下一步操作:');
    console.log('1. 对比新旧代码差异');
    console.log('2. 将 assets/shared 和 shared_components 复制到项目');
    console.log('3. 运行构建测试');
    console.log('4. 提交变更');
    console.log('='.repeat(60));
}

/**
 * 递归查找所有 source map 文件
 */
function findSourceMaps(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            findSourceMaps(filePath, fileList);
        } else if (file.endsWith('.js.map')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

/**
 * 复制提取的共享代码到项目
 */
function copyToProject() {
    const srcAssetsShared = path.join(OUTPUT_DIR, 'assets/shared');
    const srcSharedComponents = path.join(OUTPUT_DIR, 'shared_components');
    
    const dstAssetsShared = path.join(PROJECT_DIR, 'assets/shared');
    const dstSharedComponents = path.join(PROJECT_DIR, 'shared_components');
    
    if (fs.existsSync(srcAssetsShared)) {
        fs.cpSync(srcAssetsShared, dstAssetsShared, { recursive: true, force: true });
        console.log(`已复制：assets/shared`);
    }
    
    if (fs.existsSync(srcSharedComponents)) {
        fs.cpSync(srcSharedComponents, dstSharedComponents, { recursive: true, force: true });
        console.log(`已复制：shared_components`);
    }
}

// 运行主函数
main();
