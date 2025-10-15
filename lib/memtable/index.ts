import tree, { Tree } from 'functional-red-black-tree';

export interface MemTableOptions {
  maxSize?: number;
}

class MemTable<K = string, V = any> {
  private tree: Tree<K, V>;
  public readonly maxSize: number;

  constructor(maxSize: number = 100) {
    this.tree = tree<K, V>();
    this.maxSize = maxSize;
  }

  put(key: K, value: V): void {
    if (!key) {
      throw new Error('MemTable: Invalid key');
    }

    if (this.isFull()) {
      throw new Error('MemTable: Table is full');
    }

    const iter = this.tree.find(key);
    if (iter.valid) {
      this.tree = iter.update(value);
      return;
    }

    this.tree = this.tree.insert(key, value);
  }

  get(key: K): V | null {
    return this.tree.get(key) ?? null;
  }

  del(key: K): void {
    this.tree = this.tree.remove(key);
  }

  size(): number {
    return this.tree.length;
  }

  isFull(): boolean {
    return this.size() === this.maxSize;
  }

  all(): Record<string, V> {
    const result: Record<string, V> = {};
    this.tree.forEach((k: K, v: V) => {
      result[String(k)] = v;
    });
    return result;
  }
}

export default MemTable;
