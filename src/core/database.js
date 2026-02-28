/**
 * 本地資料庫 (IndexedDB)
 * 替代 Python SQLite
 */

const DB_NAME = 'CostcoShiftDB';
const DB_VERSION = 1;

class ShiftDatabase {
  constructor() {
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // 班表資料表
        if (!db.objectStoreNames.contains('shifts')) {
          const shiftStore = db.createObjectStore('shifts', { keyPath: 'date' });
          shiftStore.createIndex('type', 'type', { unique: false });
        }
        
        // 設定資料表
        if (!db.objectStoreNames.contains('config')) {
          db.createObjectStore('config', { keyPath: 'key' });
        }
        
        // 假日資料表
        if (!db.objectStoreNames.contains('holidays')) {
          db.createObjectStore('holidays', { keyPath: 'date' });
        }
      };
    });
  }

  // 儲存班表
  async saveShift(date, shiftData) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['shifts'], 'readwrite');
      const store = transaction.objectStore('shifts');
      
      const data = {
        date,
        type: shiftData.type || '',
        name: shiftData.name || '',
        hours: shiftData.hours || 0,
        overtime: shiftData.overtime || 0,
        desc: shiftData.desc || '',
        updatedAt: new Date().toISOString()
      };
      
      const request = store.put(data);
      request.onsuccess = () => resolve(data);
      request.onerror = () => reject(request.error);
    });
  }

  // 取得班表
  async getShift(date) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['shifts'], 'readonly');
      const store = transaction.objectStore('shifts');
      const request = store.get(date);
      
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  // 取得所有班表
  async getAllShifts() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['shifts'], 'readonly');
      const store = transaction.objectStore('shifts');
      const request = store.getAll();
      
      request.onsuccess = () => {
        const shifts = {};
        request.result.forEach(shift => {
          shifts[shift.date] = shift;
        });
        resolve(shifts);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // 刪除班表
  async deleteShift(date) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['shifts'], 'readwrite');
      const store = transaction.objectStore('shifts');
      const request = store.delete(date);
      
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  // 儲存設定
  async setConfig(key, value) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['config'], 'readwrite');
      const store = transaction.objectStore('config');
      const request = store.put({ key, value, updatedAt: new Date().toISOString() });
      
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  // 取得設定
  async getConfig(key, defaultValue = null) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['config'], 'readonly');
      const store = transaction.objectStore('config');
      const request = store.get(key);
      
      request.onsuccess = () => {
        resolve(request.result ? request.result.value : defaultValue);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // 取得所有設定
  async getAllConfig() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['config'], 'readonly');
      const store = transaction.objectStore('config');
      const request = store.getAll();
      
      request.onsuccess = () => {
        const config = {};
        request.result.forEach(item => {
          config[item.key] = item.value;
        });
        resolve(config);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // 儲存假日
  async saveHoliday(date, name) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['holidays'], 'readwrite');
      const store = transaction.objectStore('holidays');
      const request = store.put({ date, name });
      
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  // 取得所有假日
  async getAllHolidays() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['holidays'], 'readonly');
      const store = transaction.objectStore('holidays');
      const request = store.getAll();
      
      request.onsuccess = () => {
        const holidays = {};
        request.result.forEach(h => {
          holidays[h.date] = h.name;
        });
        resolve(holidays);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // 清除所有資料
  async clearAll() {
    return new Promise((resolve, reject) => {
      const stores = ['shifts', 'config', 'holidays'];
      let completed = 0;
      
      stores.forEach(storeName => {
        const transaction = this.db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();
        
        request.onsuccess = () => {
          completed++;
          if (completed === stores.length) resolve(true);
        };
        request.onerror = () => reject(request.error);
      });
    });
  }
}

// 導出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ShiftDatabase;
}
