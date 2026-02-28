# 🚀 GitHub 自動編譯設定指南

## 步驟 1: 創建 GitHub Repository

1. 前往 https://github.com/new
2. Repository 名稱：`costco-shift-v21-android`
3. 選擇「Public」或「Private」
4. 不要勾選「Initialize this repository with a README」
5. 點擊「Create repository」

## 步驟 2: 上傳程式碼

在本地終端執行：

```bash
cd /Volumes/Date/app/test_app/CostcoShiftV21_Android

# 初始化 Git
git init

# 添加所有檔案
git add .

# 提交
git commit -m "Initial commit: Costco Shift V2.1 Android"

# 連接遠端倉庫（請替換 YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/costco-shift-v21-android.git

# 推送
git branch -M main
git push -u origin main
```

## 步驟 3: 觸發自動編譯

推送後，GitHub Actions 會自動開始編譯：

1. 前往你的 GitHub Repository
2. 點擊「Actions」標籤
3. 查看「Build Android APK」工作流
4. 等待約 3-5 分鐘完成

## 步驟 4: 下載 APK

編譯完成後：

1. 點擊「Actions」標籤
2. 選擇最新的 workflow 執行
3. 滾動到「Artifacts」區域
4. 下載「CostcoShiftV21-APK」

或使用自動發布的 Release：
1. 點擊「Releases」標籤
2. 下載最新的 APK 檔案

## 📋 工作流程說明

### 自動觸發時機
- ✅ 推送到 `main` 分支
- ✅ 提交 Pull Request
- ✅ 手動觸發（在 Actions 頁面點擊「Run workflow」）

### 編譯輸出
- 除錯 APK（未簽署）
- 儲存在 Artifacts 中 30 天
- 自動創建 GitHub Release

## 🔧 進階設定

### 添加簽署金鑰（正式發布）

如需正式發布，請在 Repository Settings → Secrets 中添加：

```
KEYSTORE_BASE64: <base64 編碼的 keystore 檔案>
KEYSTORE_PASSWORD: <keystore 密碼>
KEY_ALIAS: <金鑰別名>
KEY_PASSWORD: <金鑰密碼>
```

### 修改 build.yml 啟用簽署

```yaml
- name: Sign APK
  uses: r0adkll/sign-android-release@v1
  with:
    releaseDirectory: android/app/build/outputs/apk/release
    signingKeyBase64: ${{ secrets.KEYSTORE_BASE64 }}
    alias: ${{ secrets.KEY_ALIAS }}
    keyStorePassword: ${{ secrets.KEYSTORE_PASSWORD }}
    keyPassword: ${{ secrets.KEY_PASSWORD }}
```

## 📱 APK 安裝

1. 下載 APK 後傳輸到 Android 設備
2. 在設備上開啟 APK 檔案
3. 允許「安裝來自未知來源的應用」
4. 完成安裝

## ⚠️ 注意事項

- GitHub Actions 每月有 2000 分鐘免費額度
- 每次推送到 main 分支都會觸發編譯
- APK 檔案未簽署，安裝時會顯示「未驗證的開發者」

## 🆘 問題排除

### 編譯失敗？
1. 檢查 Actions 日誌
2. 確認所有檔案已正確提交
3. 檢查 capacitor.config.ts 設定

### 找不到 APK？
1. 確認 workflow 成功完成
2. 檢查 Artifacts 區域
3. 查看 Release 頁面

---

**有問題？** 請在 GitHub Issues 中回報！
