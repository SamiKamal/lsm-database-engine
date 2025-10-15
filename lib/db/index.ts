import path from 'path';
import MemTable from '../memtable/index.js';

export interface DatabaseOptions {
  dataDir?: string;
  memTableMaxSize?: number;
}

class Database {
  public readonly dataDir: string;
  private memTable: MemTable<string, any>;

  constructor(options: DatabaseOptions = {}) {
    this.dataDir = options.dataDir || path.join(process.cwd(), 'data');
    this.memTable = new MemTable<string, any>(options.memTableMaxSize);
  }

  get(key: string): any | null {
    return this.memTable.get(key);
  }

  put(key: string, value: any): void {
    return this.memTable.put(key, value);
  }

  del(_key: string): void {
    // @TODO: how to handle deletions?
  }

  flush(): void {
    // @TODO:
    // - add flush function to MemTable
    // - add flush function to SSTable
  }
}

export default Database;
