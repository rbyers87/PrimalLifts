// src/lib/supabaseClient.ts
/**
 * Local database client wrapper to simulate basic CRUD operations,
 * replacing the dependency on an external backend service (Supabase).
 * This uses browser IndexedDB for persistent, client-side storage.
 */

interface RecordData {
    [key: string]: any;
}

const DB_NAME = 'FitnessAppDB';
const STORE_NAME = 'userRecords';
let db: IDBDatabase | null = null;

/**
 * Initializes and opens the connection to the IndexedDB database.
 * @returns {Promise<void>}
 */
const initDb = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (db) {
            return resolve();
        }
        const request = indexedDB.open(DB_NAME, 1);

        request.onupgradeneeded = (event) => {
            const dbInstance = (event.target as any).result;
            if (!dbInstance.objectStoreNames.contains(STORE_NAME)) {
                dbInstance.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
                console.log('Created object store: ' + STORE_NAME);
            }
        };

        request.onsuccess = (event) => {
            db = (event.target as any).result;
            console.log('Database initialized successfully.');
            resolve();
        };

        request.onerror = (event) => {
            console.error('Database error:', event);
            reject(new Error('Could not initialize database.'));
        };
    });
};

/**
 * Generic function to get a transaction object store reference.
 * @param mode 'readonly' or 'readwrite'
 * @returns {IDBObjectStore}
 */
const getStore = (mode: IDBTransactionMode): IDBObjectStore => {
    if (!db) throw new Error("Database not initialized. Call initDb() first.");
    const transaction = db.transaction([STORE_NAME], mode);
    return transaction.objectStore(STORE_NAME);
};

/**
 * Saves or updates a record in the local database.
 * @param data The record data to save. Must contain an 'id' if updating.
 * @returns {Promise<number>} The ID of the saved/updated record.
 */
export const saveRecord = async (data: RecordData): Promise<number> => {
    await initDb();
    return new Promise((resolve, reject) => {
        const store = getStore('readwrite');
        const request = store.put(data);

        request.onsuccess = (event) => {
            resolve((event.target as any).result);
        };

        request.onerror = (event) => {
            reject(new Error('Failed to save record: ' + (event.target as any).error));
        };
    });
};

/**
 * Fetches a record by its ID.
 * @param id The ID of the record.
 * @returns {Promise<RecordData | null>} The record data or null if not found.
 */
export const getRecord = async (id: number): Promise<RecordData | null> => {
    await initDb();
    return new Promise((resolve, reject) => {
        const store = getStore('readonly');
        const request = store.get(id);

        request.onsuccess = (event) => {
            resolve((event.target as any).result || null);
        };

        request.onerror = (event) => {
            reject(new Error('Failed to retrieve record: ' + (event.target as any).error));
        };
    });
};

/**
 * Fetches all records stored in the database.
 * @returns {Promise<RecordData[]>} An array of all stored records.
 */
export const getAllRecords = async (): Promise<RecordData[]> => {
    await initDb();
    return new Promise((resolve, reject) => {
        const store = getStore('readonly');
        const request = store.getAll();

        request.onsuccess = (event) => {
            resolve((event.target as any).result);
        };

        request.onerror = (event) => {
            reject(new Error('Failed to retrieve all records: ' + (event.target as any).error));
        };
    });
};

/**
 * Deletes a record by its ID.
 * @param id The ID of the record to delete.
 * @returns {Promise<void>}
 */
export const deleteRecord = async (id: number): Promise<void> => {
    await initDb();
    return new Promise((resolve, reject) => {
        const store = getStore('readwrite');
        const request = store.delete(id);

        request.onsuccess = () => {
            resolve();
        };

        request.onerror = (event) => {
            reject(new Error('Failed to delete record: ' + (event.target as any).error));
        };
    });
};

// Ensure the database is initialized on module load/first use
initDb();
