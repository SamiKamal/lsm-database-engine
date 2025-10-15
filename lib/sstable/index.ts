import fs from 'fs';

export interface SSTableOptions {
  folderPath: string;
  maxFileSize?: number;
}

class SSTable {
  #currentFile: string;
  #numOfFiles: number;
  public readonly folderPath: string;

  constructor(folderPath: string, _maxFileSize: number = 2_097_152 /* 2MB */) {
    this.folderPath = folderPath;
    this.#numOfFiles = 1;
    this.#currentFile = `sst${this.#numOfFiles}.db`;
  }

  create(data: Record<string, string>): void {
    if (typeof data !== 'object' || Array.isArray(data) || data === null) {
      throw new Error('SSTable: data must be an object');
    }
    if (Object.keys(data).length === 0) return;

    let stringifiedData = '';

    Object.keys(data).forEach(key => {
      // assumes the data is serialized
      const value = data[key];
      stringifiedData += `${key}:${value}\n`;
    });

    try {
      fs.writeFileSync(`${this.folderPath}/${this.#currentFile}`, stringifiedData, 'utf8');
    } catch (err) {
      throw new Error('SSTable: Error writing file');
    }
  }

  get(_key: string): string | null {
    // TODO: implement
    return null;
  }

  mark_tombstone(_key: string): void {
    // TODO: implement
  }

  // @TODO
  compact(): void {
    // TODO: implement
  }
}

export default SSTable;
