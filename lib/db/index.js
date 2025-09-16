import path from 'path';
import MemTable from '../memtable/index';

class Database {
    constructor(options) {
        this.dataDir = options.dataDir || path.join(process.cwd(), 'data');
        this.memTable = new MemTable();
    }

    get(key) {
        return this.memTable.get(key);
    }

    put(key, value) {
        return this.memTable.put(key, value);
    }

    del(key) {
        // @TODO: how to handle deletions?
    }

    flush() {
        // @TODO:
        // - add flush function to MemTable
        // - add flush function to SSTable
    }
}

export default Database;
