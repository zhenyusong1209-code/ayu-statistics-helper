#!/bin/bash

# 网页版部署脚本

echo "=========================================="
echo "  号码统计助手 - 网页版部署脚本"
echo "=========================================="
echo ""

# 检查是否在项目根目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误：请在项目根目录执行此脚本"
    exit 1
fi

# 选择部署方式
echo "请选择部署方式："
echo "1) 本地预览"
echo "2) 编译生产版本"
echo "3) 启动开发服务器"
echo "4) 查看编译产物"
echo ""
read -p "请输入选项 (1-4): " choice

case $choice in
    1)
        echo ""
        echo "📦 正在编译生产版本..."
        pnpm build:web
        if [ $? -eq 0 ]; then
            echo ""
            echo "✅ 编译成功！"
            echo ""
            echo "📁 编译产物位置：dist-web/"
            echo ""
            echo "💡 提示：你可以使用以下方式预览："
            echo "   - 使用 VS Code 的 Live Server 插件"
            echo "   - 使用 Python: python -m http.server 8000 -d dist-web"
            echo "   - 使用 Node.js: npx serve dist-web"
            echo ""
            read -p "是否使用 Python 启动本地预览？(y/n): " start_python
            if [ "$start_python" = "y" ]; then
                echo ""
                echo "🚀 启动 Python HTTP 服务器..."
                python -m http.server 8000 -d dist-web
            fi
        else
            echo "❌ 编译失败"
            exit 1
        fi
        ;;
    2)
        echo ""
        echo "📦 正在编译生产版本..."
        pnpm build:web
        if [ $? -eq 0 ]; then
            echo ""
            echo "✅ 编译成功！"
            echo ""
            echo "📁 编译产物："
            ls -lh dist-web/
            echo ""
            echo "💡 提示：将 dist-web 目录部署到你的 Web 服务器"
        else
            echo "❌ 编译失败"
            exit 1
        fi
        ;;
    3)
        echo ""
        echo "🚀 启动开发服务器..."
        echo "访问地址：http://localhost:5000"
        echo ""
        echo "💡 提示：按 Ctrl+C 停止服务器"
        pnpm dev:web
        ;;
    4)
        echo ""
        echo "📁 编译产物："
        ls -lh dist-web/
        echo ""
        echo "📊 文件大小统计："
        du -sh dist-web/
        echo ""
        echo "📄 index.html 内容："
        head -20 dist-web/index.html
        ;;
    *)
        echo "❌ 无效选项"
        exit 1
        ;;
esac

echo ""
echo "=========================================="
echo "  部署脚本执行完成"
echo "=========================================="
