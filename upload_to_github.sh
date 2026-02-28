#!/bin/bash
# GitHub 上傳助手腳本

echo "🚀 Costco 班表 V2.1 - GitHub 上傳助手"
echo "====================================="
echo ""

# 專案路徑
PROJECT_DIR="/Volumes/Date/app/test_app/CostcoShiftV21_Android"
cd "$PROJECT_DIR"

# 檢查 Git 是否已初始化
if [ -d ".git" ]; then
    echo "✅ Git 已初始化"
else
    echo "📝 初始化 Git..."
    git init
fi

# 檢查遠端倉庫
REMOTE_URL=$(git remote get-url origin 2>/dev/null || echo "")

if [ -z "$REMOTE_URL" ]; then
    echo ""
    echo "📋 請先創建 GitHub Repository："
    echo "   https://github.com/new"
    echo ""
    echo "然後輸入你的 GitHub 用戶名和倉庫名："
    echo ""
    read -p "GitHub 用戶名: " USERNAME
    read -p "倉庫名稱 (預設: costco-shift-v21-android): " REPO_NAME
    
    REPO_NAME=${REPO_NAME:-costco-shift-v21-android}
    
    echo ""
    echo "🔗 連接遠端倉庫..."
    git remote add origin "https://github.com/$USERNAME/$REPO_NAME.git"
    echo "✅ 已設定遠端: https://github.com/$USERNAME/$REPO_NAME.git"
else
    echo "✅ 遠端倉庫: $REMOTE_URL"
fi

echo ""
echo "📦 準備上傳檔案..."

# 檢查是否有未提交的更改
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 添加所有檔案..."
    git add .
    
    echo "💾 提交更改..."
    git commit -m "Update: $(date '+%Y-%m-%d %H:%M:%S')"
else
    echo "✅ 沒有新的更改需要提交"
fi

# 推送
echo ""
echo "☁️ 推送到 GitHub..."
git branch -M main 2>/dev/null || true
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 上傳成功！"
    echo ""
    REMOTE_URL=$(git remote get-url origin)
    echo "📱 GitHub Repository: $REMOTE_URL"
    echo ""
    echo "下一步："
    echo "1. 前往 GitHub 查看 Actions 頁面"
    echo "2. 等待編譯完成（約 3-5 分鐘）"
    echo "3. 下載 APK 檔案"
else
    echo ""
    echo "❌ 推送失敗，請檢查："
    echo "1. GitHub 倉庫是否已創建"
    echo "2. 是否有推送權限"
    echo "3. 網路連線是否正常"
fi
