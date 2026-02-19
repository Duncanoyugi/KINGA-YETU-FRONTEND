/**
 * IndexedDB service for offline storage and caching
 */

interface DBSchema {
  name: string;
  version: number;
  stores: {
    name: string;
    keyPath: string;
    indexes?: Array<{
      name: string;
      keyPath: string;
      options?: IDBIndexParameters;
    }>;
  }[];
}

const DB_NAME = 'ImmuniTrackDB';
const DB_VERSION = 1;

const schema: DBSchema = {
  name: DB_NAME,
  version: DB_VERSION,
  stores: [
    {
      name: 'offlineChildren',
      keyPath: 'id',
      indexes: [
        { name: 'by-parent', keyPath: 'parentId' },
        { name: 'by-sync', keyPath: 'syncStatus' },
      ],
    },
    {
      name: 'offlineVaccines',
      keyPath: 'id',
      indexes: [
        { name: 'by-code', keyPath: 'code' },
        { name: 'by-sync', keyPath: 'syncStatus' },
      ],
    },
    {
      name: 'offlineImmunizations',
      keyPath: 'id',
      indexes: [
        { name: 'by-child', keyPath: 'childId' },
        { name: 'by-sync', keyPath: 'syncStatus' },
      ],
    },
    {
      name: 'offlineGrowthRecords',
      keyPath: 'id',
      indexes: [
        { name: 'by-child', keyPath: 'childId' },
        { name: 'by-sync', keyPath: 'syncStatus' },
      ],
    },
    {
      name: 'offlineNotifications',
      keyPath: 'id',
      indexes: [
        { name: 'by-user', keyPath: 'userId' },
        { name: 'by-read', keyPath: 'isRead' },
      ],
    },
    {
      name: 'syncQueue',
      keyPath: 'id',
      indexes: [
        { name: 'by-priority', keyPath: 'priority' },
        { name: 'by-status', keyPath: 'status' },
      ],
    },
    {
      name: 'cache',
      keyPath: 'key',
    },
  ],
};

class IndexedDBService {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<void> | null = null;

  async init(): Promise<void> {
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('Failed to open IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('IndexedDB initialized successfully');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores
        schema.stores.forEach(store => {
          if (!db.objectStoreNames.contains(store.name)) {
            const objectStore = db.createObjectStore(store.name, { 
              keyPath: store.keyPath 
            });
            
            // Create indexes
            store.indexes?.forEach(index => {
              objectStore.createIndex(index.name, index.keyPath, index.options);
            });
          }
        });
      };
    });

    return this.initPromise;
  }

  private async getDB(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.init();
    }
    if (!this.db) {
      throw new Error('IndexedDB not initialized');
    }
    return this.db;
  }

  // Generic CRUD operations
  async get<T>(storeName: string, key: string): Promise<T | null> {
    const db = await this.getDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getAll<T>(storeName: string, query?: IDBKeyRange): Promise<T[]> {
    const db = await this.getDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll(query);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async put<T>(storeName: string, value: T): Promise<void> {
    const db = await this.getDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(value);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async bulkPut<T>(storeName: string, values: T[]): Promise<void> {
    const db = await this.getDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);

      values.forEach(value => {
        store.put(value);
      });
    });
  }

  async delete(storeName: string, key: string): Promise<void> {
    const db = await this.getDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clear(storeName: string): Promise<void> {
    const db = await this.getDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Query by index
  async getByIndex<T>(
    storeName: string, 
    indexName: string, 
    value: any
  ): Promise<T[]> {
    const db = await this.getDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.getAll(value);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Cache operations
  async setCache(key: string, data: any, ttl?: number): Promise<void> {
    const cacheEntry = {
      key,
      data,
      timestamp: Date.now(),
      ttl: ttl || 5 * 60 * 1000, // Default 5 minutes
    };
    await this.put('cache', cacheEntry);
  }

  async getCache<T>(key: string): Promise<T | null> {
    const entry = await this.get<{
      data: T;
      timestamp: number;
      ttl: number;
    }>('cache', key);

    if (!entry) return null;

    // Check if cache is expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      await this.delete('cache', key);
      return null;
    }

    return entry.data;
  }

  async clearCache(): Promise<void> {
    await this.clear('cache');
  }

  // Sync queue operations
  async addToSyncQueue(item: {
    id?: string;
    operation: 'CREATE' | 'UPDATE' | 'DELETE';
    store: string;
    data: any;
    priority: number;
  }): Promise<void> {
    const syncItem = {
      ...item,
      id: item.id || crypto.randomUUID(),
      status: 'pending',
      createdAt: Date.now(),
      retryCount: 0,
    };
    await this.put('syncQueue', syncItem);
  }

  async getPendingSyncItems(): Promise<any[]> {
    const items = await this.getAll<any>('syncQueue');
    return items
      .filter(item => item.status === 'pending')
      .sort((a, b) => b.priority - a.priority);
  }

  async markSyncComplete(id: string): Promise<void> {
    await this.delete('syncQueue', id);
  }

  async markSyncFailed(id: string): Promise<void> {
    const item = await this.get<any>('syncQueue', id);
    if (item) {
      item.status = 'failed';
      item.retryCount = (item.retryCount || 0) + 1;
      await this.put('syncQueue', item);
    }
  }

  // Offline data operations
  async saveOfflineData(store: string, data: any): Promise<void> {
    await this.put(store, {
      ...data,
      syncStatus: 'pending',
      lastModified: Date.now(),
    });
  }

  async getOfflineData<T>(store: string, id: string): Promise<T | null> {
    return this.get<T>(store, id);
  }

  async getAllOfflineData<T>(store: string): Promise<T[]> {
    return this.getAll<T>(store);
  }

  async getPendingSync(store: string): Promise<any[]> {
    return this.getByIndex(store, 'by-sync', 'pending');
  }

  async markSynced(store: string, id: string): Promise<void> {
    const item = await this.get<any>(store, id);
    if (item) {
      item.syncStatus = 'synced';
      await this.put(store, item);
    }
  }

  // Cleanup
  async clearAll(): Promise<void> {
    const db = await this.getDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(schema.stores.map(s => s.name), 'readwrite');
      
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);

      schema.stores.forEach(store => {
        transaction.objectStore(store.name).clear();
      });
    });
  }

  async clearOldData(daysOld: number = 30): Promise<void> {
    const cutoff = Date.now() - daysOld * 24 * 60 * 60 * 1000;
    const db = await this.getDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(schema.stores.map(s => s.name), 'readwrite');
      
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);

      schema.stores.forEach(store => {
        if (store.name !== 'offlineNotifications') {
          const objectStore = transaction.objectStore(store.name);
          const request = objectStore.openCursor();
          
          request.onsuccess = (event) => {
            const cursor = (event.target as IDBRequest).result;
            if (cursor) {
              if (cursor.value.lastModified && cursor.value.lastModified < cutoff) {
                cursor.delete();
              }
              cursor.continue();
            }
          };
        }
      });
    });
  }
}

export const indexedDBService = new IndexedDBService();
export default indexedDBService;