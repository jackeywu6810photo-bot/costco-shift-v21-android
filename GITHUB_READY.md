# 🚀 Costco 班表 V2.1 Android - GitHub 編譯完成！

## ✅ 已完成設定

### 📁 專案位置
```
/Volumes/Date/app/test_app/CostcoShiftV21_Android/
```

### 📦 檔案結構
```
CostcoShiftV21_Android/
├── .github/
│   └── workflows/
│       └── build.yml          # GitHub Actions 自動編譯
├── src/core/
│   ├── calculator.js          # 加班費計算
│   ├── database.js            # 本地資料庫
│   ├── ai_scheduler.js        # AI 建議
│   └── firebase_sync.js       # 雲端同步
├── android/                   # Android 原生專案
├── index.html                 # 主頁面
├── capacitor.config.ts        # Capacitor 設定
├── package.json               # NPM 設定
├── .gitignore                 # Git 忽略規則
├── build_android.sh           # 本地構建腳本
├── upload_to_github.sh        # GitHub 上傳助手
├── GITHUB_SETUP.md            # GitHub 設定指南
└── README.md                  # 專案說明
```

---

## 🚀 使用方式（二選一）

### 方式 1：GitHub 自動編譯（推薦）

**步驟 1：創建 GitHub Repository**
- 前往 https://github.com/new
- Repository 名稱：`costco-shift-v21-android`
- 點擊「Create repository」

**步驟 2：執行上傳腳本**
```bash
cd /Volumes/Date/app/test_app/CostcoShiftV21_Android
./upload_to_github.sh
```

或手動：
```bash
cd /Volumes/Date/app/test_app/CostcoShiftV21_Android
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/你的用戶名/costco-shift-v21-android.git
git branch -M main
git push -u origin main
```

**步驟 3：下載 APK**
1. 前往 GitHub Repository → Actions 標籤
2. 等待「Build Android APK」完成（約 3-5 分鐘）
3. 下載 Artifacts 中的 APK 檔案

---

### 方式 2：本地編譯

**需求：**
- Android Studio
- Node.js 16+

**步驟：**
```bash
cd /Volumes/Date/app/test_app/CostcoShiftV21_Android
./build_android.sh
```

輸出：`android/app/build/outputs/apk/release/app-release-unsigned.apk`

---

## ✨ 功能特色

| 功能 | 狀態 |
|------|------|
| ✅ 班表管理 | 早班/晚班/休假 |
| ✅ 加班計算 | 358×1.667/2.667 倍率 |
| ✅ 本地資料庫 | IndexedDB |
| ✅ AI 建議 | 疲勞度分析 |
| ✅ 雲端同步 | Firebase Firestore |
| ✅ 離線使用 | 無網路也可使用 |

---

## 📱 安裝 APK

1. 下載 APK 檔案
2. 傳輸到 Android 設備
3. 開啟 APK 檔案
4. 允許「安裝來自未知來源的應用」
5. 完成安裝！

---

## 🔧 技術細節

- **App ID**: `com.costco.shiftmanager.v21`
- **最低 SDK**: Android 5.1 (API 22)
- **目標 SDK**: Android 13 (API 33)
- **資料庫**: IndexedDB (替代 SQLite)
- **圖表**: Chart.js
- **雲端**: Firebase Firestore

---

## 📝 詳細說明文件

- `README.md` - 專案說明
- `GITHUB_SETUP.md` - GitHub 設定詳細指南
- `build_android.sh` - 本地構建腳本
- `upload_to_github.sh` - GitHub 上傳助手

---

## 🎉 完成！

您的 Android 版本已準備就緒，可以上傳到 GitHub 自動編譯了！

**準備好了嗎？** 執行：
```bash
cd /Volumes/Date/app/test_app/CostcoShiftV21_Android
./upload_to_github.sh
```
