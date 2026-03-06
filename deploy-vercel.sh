#!/bin/bash

# AYU统计助手 - Vercel 快速部署脚本

echo "╔══════════════════════════════════════════════════════════╗"
echo "║     AYU统计助手 - Vercel 快速部署工具                    ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# 检查是否已初始化 Git
if [ ! -d ".git" ]; then
    echo "📝 步骤 1: 初始化 Git 仓库..."
    git init
    echo "✅ Git 仓库已初始化"
    echo ""
fi

# 创建 .gitignore（如果不存在）
if [ ! -f ".gitignore" ]; then
    echo "📝 步骤 2: 创建 .gitignore 文件..."
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Build outputs
dist/
dist-web/
dist-tt/

# Environment variables
.env
.env.local
.env.*.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*
/tmp/
*.log

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Coze
.coze/
.cache/
EOF
    echo "✅ .gitignore 文件已创建"
    echo ""
fi

# 提示用户下一步
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 下一步操作指南"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1️⃣  创建 GitHub 仓库"
echo "   • 访问 https://github.com/new"
echo "   • 仓库名称: ayu-statistics-helper"
echo "   • 点击 Create repository"
echo ""
echo "2️⃣  添加远程仓库（替换 YOUR_USERNAME）"
echo "   git remote add origin https://github.com/YOUR_USERNAME/ayu-statistics-helper.git"
echo ""
echo "3️⃣  提交代码"
echo "   git add ."
echo "   git commit -m 'feat: 初始化 AYU统计助手'"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "4️⃣  在 Vercel 部署"
echo "   • 访问 https://vercel.com/dashboard"
echo "   • 点击 Add New → Project"
echo "   • 选择你的 GitHub 仓库"
echo "   • 点击 Deploy"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📖 详细文档: vercel-deployment-guide.md"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ 准备完成！现在可以按照上面的步骤进行部署了。"
