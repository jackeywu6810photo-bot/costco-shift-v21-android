/**
 * Firebase 雲端同步 (JavaScript 版本)
 * 轉換自 Python core/firebase_sync.py
 */

// Firebase 配置
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyC2hNO_hP6fT3i49f6Oj1J6yv1xrkYMxWY",
  authDomain: "costco-shift-manager.firebaseapp.com",
  projectId: "costco-shift-manager",
  storageBucket: "costco-shift-manager.firebasestorage.app",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abc123def456"
};

class FirebaseSync {
  constructor() {
    this.db = null;
    this.auth = null;
    this.userId = null;
    this.initialized = false;
  }

  /**
   * 初始化 Firebase
   */
  async init() {
    // 檢查是否已載入 Firebase SDK
    if (typeof firebase === 'undefined') {
      console.error('Firebase SDK 未載入');
      return false;
    }

    try {
      // 初始化 Firebase App
      if (!firebase.apps.length) {
        firebase.initializeApp(FIREBASE_CONFIG);
      }
      
      this.db = firebase.firestore();
      this.auth = firebase.auth();
      this.initialized = true;
      
      console.log('Firebase 初始化成功');
      return true;
    } catch (error) {
      console.error('Firebase 初始化失敗:', error);
      return false;
    }
  }

  /**
   * 設置用戶 ID（簡化登入，使用電子郵件作為 ID）
   * @param {string} email - 用戶電子郵件
   */
  setUserId(email) {
    this.userId = email.replace(/[.#$\[\]]/g, '_');
    localStorage.setItem('costco_user_id', this.userId);
    return this.userId;
  }

  /**
   * 取得儲存的用戶 ID
   */
  getUserId() {
    if (!this.userId) {
      this.userId = localStorage.getItem('costco_user_id');
    }
    return this.userId;
  }

  /**
   * 上傳資料到雲端
   * @param {Object} data - 要上傳的資料
   */
  async uploadToCloud(data) {
    if (!this.initialized || !this.userId) {
      throw new Error('Firebase 未初始化或用戶未登入');
    }

    try {
      const docRef = this.db.collection('users').doc(this.userId);
      
      await docRef.set({
        shifts: data.shifts || {},
        config: data.config || {},
        holidays: data.holidays || {},
        lastSync: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });

      // 儲存同步時間
      localStorage.setItem('last_sync', new Date().toISOString());
      
      return { success: true, message: '上傳成功' };
    } catch (error) {
      console.error('上傳失敗:', error);
      throw error;
    }
  }

  /**
   * 從雲端下載資料
   */
  async downloadFromCloud() {
    if (!this.initialized || !this.userId) {
      throw new Error('Firebase 未初始化或用戶未登入');
    }

    try {
      const docRef = this.db.collection('users').doc(this.userId);
      const doc = await docRef.get();

      if (!doc.exists) {
        return { 
          success: false, 
          message: '雲端無資料',
          data: null
        };
      }

      const data = doc.data();
      
      // 儲存同步時間
      localStorage.setItem('last_sync', new Date().toISOString());

      return {
        success: true,
        message: '下載成功',
        data: {
          shifts: data.shifts || {},
          config: data.config || {},
          holidays: data.holidays || {}
        }
      };
    } catch (error) {
      console.error('下載失敗:', error);
      throw error;
    }
  }

  /**
   * 同步資料（上傳本地資料到雲端）
   * @param {Object} localData - 本地資料庫資料
   */
  async sync(localData) {
    try {
      // 先嘗試下載雲端資料
      const cloudData = await this.downloadFromCloud();
      
      if (!cloudData.success || !cloudData.data) {
        // 雲端無資料，直接上傳本地資料
        return await this.uploadToCloud(localData);
      }

      // 合併資料（以最新時間為準）
      const mergedData = this.mergeData(localData, cloudData.data);
      
      // 上傳合併後的資料
      await this.uploadToCloud(mergedData);
      
      return {
        success: true,
        message: '同步成功',
        data: mergedData
      };
    } catch (error) {
      console.error('同步失敗:', error);
      throw error;
    }
  }

  /**
   * 合併本地和雲端資料
   */
  mergeData(local, cloud) {
    const merged = {
      shifts: { ...cloud.shifts },
      config: { ...cloud.config },
      holidays: { ...cloud.holidays }
    };

    // 合併班表（以更新時間較新的為準）
    if (local.shifts) {
      Object.keys(local.shifts).forEach(date => {
        const localShift = local.shifts[date];
        const cloudShift = cloud.shifts?.[date];
        
        if (!cloudShift || (localShift.updatedAt > cloudShift.updatedAt)) {
          merged.shifts[date] = localShift;
        }
      });
    }

    // 合併設定
    if (local.config) {
      Object.keys(local.config).forEach(key => {
        merged.config[key] = local.config[key];
      });
    }

    return merged;
  }

  /**
   * 檢查同步狀態
   */
  getSyncStatus() {
    const lastSync = localStorage.getItem('last_sync');
    const userId = this.getUserId();
    
    return {
      isLoggedIn: !!userId,
      userId: userId,
      lastSync: lastSync ? new Date(lastSync).toLocaleString() : '尚未同步'
    };
  }
}

// 導出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FirebaseSync;
}
