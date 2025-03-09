class MemTable {
    constructor(maxSize = 100) {
        // @TODO: should use a sorted data structure
        this.table = new Map();
        this.maxSize = maxSize;
    }

    put(key, value) {
        if (!key) {
            throw new Error('MemTable: Invalid key');
        }

        if (this.isFull()) {
            throw new Error('MemTable: Table is full');
        }

        this.table.set(key, value);
    }

    get(key) {
        return this.table.get(key) || null;
    }

    del(key) {
        this.table.delete(key);
    }

    size() {
        return this.table.size;
    }

    isFull() {
        return this.table.size === this.maxSize;
    }
}

export default MemTable;
