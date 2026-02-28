#!/bin/bash
# Costco 班表 V2.1 Android 構建腳本

set -e

echo "🚀 Costco 班表 V2.1 Android 構建腳本"
echo "================================"

# 專案路徑
PROJECT_DIR="/Volumes/Date/app/test_app/CostcoShiftV21_Android"
cd "$PROJECT_DIR"

echo ""
echo "📦 步驟 1: 安裝依賴..."
npm install 2>/dev/null || echo "⚠️  npm install 失敗，繼續構建..."

echo ""
echo "📦 步驟 2: 同步 Capacitor..."
npx cap sync android

echo ""
echo "📦 步驟 3: 複製資源到 Android..."
# 確保資源最新
mkdir -p android/app/src/main/assets/public/src/core
cp index.html android/app/src/main/assets/public/
cp src/core/*.js android/app/src/main/assets/public/src/core/

echo ""
echo "📦 步驟 4: 構建 Release APK..."
cd android
./gradlew assembleRelease

echo ""
echo "✅ 構建完成！"
echo ""
echo "📱 APK 位置:"
APK_PATH="app/build/outputs/apk/release/app-release-unsigned.apk"
if [ -f "$APK_PATH" ]; then
    echo "   $PROJECT_DIR/android/$APK_PATH"
    ls -lh "$APK_PATH"
    
    # 複製到發布目錄
    RELEASE_DIR="/Volumes/Date/app/ok_app"
    cp "$APK_PATH" "$RELEASE_DIR/Costco班表V21_Android.apk"
    echo ""
    echo "📦 已複製到: $RELEASE_DIR/Costco班表V21_Android.apk"
else
    echo "   ⚠️ 未找到 APK 檔案"
fi

echo ""
echo "🎉 完成！"
