# Costco 班表管理 V2.1 - Android 版本

## 📱 專案說明

這是 Costco 班表管理系統的 Android 版本，使用 Capacitor + Web 技術開發。

## 🚀 快速開始

### 需求
- Node.js 16+
- Android Studio
- JDK 11+

### 安裝依賴
```bash
cd /Volumes/Date/app/test_app/CostcoShiftV21_Android
npm install
```

### 構建 APK
```bash
# 1. 同步 Capacitor
npx cap sync

# 2. 構建 Release APK
cd android
./gradlew assembleRelease

# 或打開 Android Studio
npx cap open android
```

### 輸出位置
```
android/app/build/outputs/apk/release/app-release-unsigned.apk
```

## 📁 檔案結構

```
CostcoShiftV21_Android/
├── android/              # Android 原生專案
├── src/
│   └── core/
│       ├── calculator.js     # 加班費計算
│       ├── database.js       # IndexedDB 本地儲存
│       ├── ai_scheduler.js   # AI 排班建議
│       └── firebase_sync.js  # Firebase 雲端同步
├── index.html            # 主頁面
├── package.json          # NPM 設定
└── capacitor.config.ts   # Capacitor 設定
```

## ✨ 功能

- ✅ 班表管理（早班/晚班/休假）
- ✅ 加班費自動計算
- ✅ 工作時長統計
- ✅ AI 疲勞分析
- ✅ 雲端同步（Firebase）
- ✅ 離線使用

## 🔧 核心模組

### calculator.js
加班費計算邏輯，支援自定義倍率。

### database.js
IndexedDB 本地資料庫，替代 SQLite。

### ai_scheduler.js
工作模式分析、疲勞指數計算。

### firebase_sync.js
Firestore 雲端同步。

## 📦 打包資訊

| 項目 | 值 |
|------|-----|
| App ID | com.costco.shiftmanager.v21 |
| App Name | Costco班表V21 |
| 版本 | 2.1.0 |
| 最低 SDK | 22 (Android 5.1) |
| 目標 SDK | 33 (Android 13) |

---
*創建時間: 2026-03-01*
