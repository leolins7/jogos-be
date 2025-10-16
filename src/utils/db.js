// src/utils/db.js
import { openDB } from 'idb';

const DB_NAME = 'jogos-be-db';
const DB_VERSION = 1;

// Inicializa o banco de dados e cria as "tabelas" (object stores) se não existirem
export const initDB = () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('memory_card_pairs')) {
        db.createObjectStore('memory_card_pairs', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('guess_or_leave_phrases')) {
        db.createObjectStore('guess_or_leave_phrases', { keyPath: 'id' });
      }
    },
  });
};

// Salva um array de dados em uma tabela, limpando os dados antigos primeiro
export const saveDataToDB = async (storeName, data) => {
  const db = await initDB();
  const tx = db.transaction(storeName, 'readwrite');
  await tx.store.clear(); // Garante que sempre teremos os dados mais recentes
  for (const item of data) {
    tx.store.add(item);
  }
  await tx.done;
};

// Pega todos os dados de uma tabela
export const getDataFromDB = async (storeName) => {
  const db = await initDB();
  return db.getAll(storeName);
};