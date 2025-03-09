import tree from 'functional-red-black-tree';

class MemTable {
    constructor(maxSize = 100) {
        this.tree = tree();
        this.maxSize = maxSize;
    }

    put(key, value) {
        if (!key) {
            throw new Error('MemTable: Invalid key');
        }

        if (this.isFull()) {
            throw new Error('MemTable: Table is full');
        }

        var iter = this.tree.find(key);
        if (iter.valid) {
            this.tree = iter.update(value);
            return;
        }

        this.tree = this.tree.insert(key, value);
    }

    get(key) {
        return this.tree.get(key) || null;
    }

    del(key) {
        this.tree = this.tree.remove(key);
    }

    size() {
        return this.tree.length;
    }

    isFull() {
        return this.size() === this.maxSize;
    }

    all() {
        let result = {};
        this.tree.forEach(function (k, v) {
            result[k] = v;
        })

        return result;
    }
}

export default MemTable;
