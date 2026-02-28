#!/bin/bash
# GitHub 上傳助手

cd "$(dirname "$0")"

echo "🚀 GitHub 上傳助手"
echo "=================="
echo ""

echo "📋 當前狀態："
echo "  Git 分支: $(git branch --show-current)"
echo "  提交數: $(git rev-list --count HEAD)"
echo "  遠端: $(git remote get-url origin 2>/dev/null || echo '未設定')"
echo ""

# 檢查是否已推送
if git ls-remote origin > /dev/null 2>&1; then
    echo "✅ 倉庫已存在"
    echo "🔄 推送最新更改..."
    git push origin main
    echo ""
    echo "🎉 完成！"
    echo "  https://github.com/jkhomeclaw/costco-shift-v21-android"
else
    echo "⚠️  請先在 GitHub 創建倉庫："
    echo "  https://github.com/new"
    echo "  Repository name: costco-shift-v21-android"
fi
