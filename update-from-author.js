/**
 * NR-Editor 自动更新工具
 * 
 * 用途：当作者发布新版本时，自动提取并更新共享代码
 * 
 * 使用流程：
 * 1. 下载并安装新版 NewRecruit Editor
 * 2. 解包新版本：asar extract "app.asar" app-extracted-new
 * 3. 运行此脚本：node update-from-author.js
 * 4. 检查差异并提交
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ==================== 配置区域 ====================

const CONFIG = {
    // 新版本解包目录
    newVersionDir: "C:/Users/zhang/AppData/Local/Programs/NewRecruit Editor/resources/app-extracted",
    
    // 临时提取目录
    tempExtractDir: "C:/Users/zhang/Desktop/nr-sources-extracted-new",
    
    // 项目目录
    projectDir: "C:/Users/zhang/WebstormProjects/nr-editor",
    
    // 需要更新的目录
    targetDirs: [
        'assets/shared',
        'shared_components'
    ]
};

// ==================== 主函数 ====================

function main() {
    console.log('╔' + '═'.repeat(58) + '╗');
    console.log('║' + center('NR-Editor 自动更新工具', 58) + '║');
    console.log('╚' + '═'.repeat(58) + '╝');
    console.log();
    
    // 步骤 1: 提取新版本源代码
    console.log('[步骤 1/4] 提取新版本源代码...');
    const newFiles = extractSources(CONFIG.newVersionDir, CONFIG.tempExtractDir);
    console.log(`✓ 提取了 ${newFiles.size} 个文件`);
    
    // 步骤 2: 对比差异
    console.log('\n[步骤 2/4] 对比代码差异...');
    const changes = compareDirectories(newFiles);
    printChanges(changes);
    
    // 步骤 3: 备份当前代码
    console.log('\n[步骤 3/4] 备份当前代码...');
    backupCurrentCode();
    console.log('✓ 备份完成');
    
    // 步骤 4: 更新代码
    console.log('\n[步骤 4/4] 更新共享代码...');
    updateCode(CONFIG.tempExtractDir, CONFIG.projectDir);
    console.log('✓ 更新完成');
    
    // 完成
    console.log('\n' + '═'.repeat(60));
    console.log('更新完成！请执行以下操作:');
    console.log('  1. 运行 npm run build 验证构建');
    console.log('  2. 检查 git diff 查看变更');
    console.log('  3. 测试应用程序功能');
    console.log('  4. 提交变更：git commit -m "更新共享代码 (作者版本 xxx)"');
    console.log('═'.repeat(60));
}

/**
 * 提取源代码
 */
function extractSources(inputDir, outputDir) {
    if (!fs.existsSync(inputDir)) {
        throw new Error(`找不到输入目录：${inputDir}`);
    }
    
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const extractedFiles = new Map();
    const mapFiles = findSourceMaps(inputDir);
    
    for (const mapFile of mapFiles) {
        try {
            const mapContent = JSON.parse(fs.readFileSync(mapFile, 'utf8'));
            
            if (!mapContent.sources || !mapContent.sourcesContent) continue;
            
            for (let i = 0; i < mapContent.sources.length; i++) {
                const sourcePath = mapContent.sources[i];
                const content = mapContent.sourcesContent[i];
                
                if (!content) continue;
                
                const normalizedPath = sourcePath
                    .replace(/\.\.\//g, '')
                    .replace(/\\/g, '/');
                
                if (!normalizedPath.match(/\.(vue|ts|js|scss|css)$/i)) continue;
                
                const outPath = path.join(outputDir, normalizedPath);
                const outDir = path.dirname(outPath);
                
                if (!fs.existsSync(outDir)) {
                    fs.mkdirSync(outDir, { recursive: true });
                }
                
                const key = normalizedPath.toLowerCase();
                if (extractedFiles.has(key)) continue;
                
                fs.writeFileSync(outPath, content, 'utf8');
                extractedFiles.set(key, outPath);
            }
        } catch (err) {
            // 跳过错误文件
        }
    }
    
    return extractedFiles;
}

/**
 * 对比目录
 */
function compareDirectories(newFiles) {
    const changes = {
        added: [],
        modified: [],
        unchanged: []
    };
    
    for (const [key, newPath] of newFiles) {
        const projectPath = path.join(CONFIG.projectDir, key);
        
        if (!fs.existsSync(projectPath)) {
            changes.added.push(key);
        } else {
            const oldContent = fs.readFileSync(projectPath, 'utf8');
            const newContent = fs.readFileSync(newPath, 'utf8');
            
            if (oldContent !== newContent) {
                changes.modified.push(key);
            } else {
                changes.unchanged.push(key);
            }
        }
    }
    
    return changes;
}

/**
 * 打印变更
 */
function printChanges(changes) {
    console.log(`  新增文件：${changes.added.length} 个`);
    console.log(`  修改文件：${changes.modified.length} 个`);
    console.log(`  未变更：${changes.unchanged.length} 个`);
    
    if (changes.added.length > 0) {
        console.log('\n  新增文件列表:');
        changes.added.slice(0, 10).forEach(f => console.log(`    + ${f}`));
        if (changes.added.length > 10) {
            console.log(`    ... 还有 ${changes.added.length - 10} 个`);
        }
    }
    
    if (changes.modified.length > 0) {
        console.log('\n  修改文件列表:');
        changes.modified.slice(0, 10).forEach(f => console.log(`    ~ ${f}`));
        if (changes.modified.length > 10) {
            console.log(`    ... 还有 ${changes.modified.length - 10} 个`);
        }
    }
}

/**
 * 备份当前代码
 */
function backupCurrentCode() {
    const backupDir = path.join(CONFIG.projectDir, '.backup-shared-code');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = `${backupDir}-${timestamp}`;
    
    for (const dir of CONFIG.targetDirs) {
        const srcPath = path.join(CONFIG.projectDir, dir);
        if (fs.existsSync(srcPath)) {
            const destPath = path.join(backupPath, dir);
            fs.cpSync(srcPath, destPath, { recursive: true, force: true });
        }
    }
    
    console.log(`  备份位置：${backupPath}`);
}

/**
 * 更新代码
 */
function updateCode(sourceDir, targetDir) {
    for (const subdir of CONFIG.targetDirs) {
        const srcPath = path.join(sourceDir, subdir);
        const dstPath = path.join(targetDir, subdir);
        
        if (fs.existsSync(srcPath)) {
            fs.cpSync(srcPath, dstPath, { recursive: true, force: true });
            console.log(`  已更新：${subdir}`);
        }
    }
}

/**
 * 查找 source map 文件
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
 * 居中文字
 */
function center(text, width) {
    const padding = Math.floor((width - text.length) / 2);
    return ' '.repeat(padding) + text + ' '.repeat(width - padding - text.length);
}

// 运行
main();
