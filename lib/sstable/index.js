import fs from "fs";

class SSTable {
  #currentFile;
  #numOfFiles;

  constructor(folderPath, maxFileSize = 2_097_152 /* 2MB */) {
    this.folderPath = folderPath;
    this.#numOfFiles = 1;
    this.#currentFile = `sst${this.#numOfFiles}.db`;
  }

  create(data) {
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

  get(key) {}

  mark_tombstone(key) {}

  // @TODO
  compact() {}
}

export default SSTable;
