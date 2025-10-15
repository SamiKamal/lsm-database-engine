import fs from 'fs';
import path from 'path';
import SSTable from '../index';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

xdescribe("SSTable", () => {
  const testFolderPath = path.join(__dirname, '/data');
  let sstable: SSTable;

  beforeEach(() => {
    sstable = new SSTable(testFolderPath);
  });

  afterEach(() => {
    const files = fs.readdirSync(testFolderPath);
    for (const file of files) {
      // fs.unlinkSync(path.join(testFolderPath, file));
      console.log(`Deleted ${file}`);
    }
  });

  // ---- 1. Initialization ----
  test("should initialize with a given file path", () => {
    expect((sstable as any).filePath).toBe(testFolderPath);
    expect((sstable as any).currentFile).toBeNull();
  });

  // ---- 2. SSTable Creation ----
  test.only("should create an SSTable from a memtable", () => {
    const data = {
      apple: "red",
      banana: "yellow",
      carrot: "orange"
    };

    sstable.create(data);

    const fileData = getFirstFileDataSync(testFolderPath);
    console.log(fileData);

    expect(fileData).not.toBe(null);

    expect(fileData?.includes("apple:red")).toBe(true);
    expect(fileData?.includes("banana:yellow")).toBe(true);
    expect(fileData?.includes("carrot:orange")).toBe(true);
  });

  test("should handle an empty memtable without creating a file", () => {
    const data = {};

    sstable.create(data);
    expect(fs.existsSync(testFolderPath)).toBe(false);
  });

  // ---- 3. Data Retrieval ----
  test("should retrieve an existing key from the SSTable", () => {
    fs.writeFileSync(testFolderPath, "apple:red\nbanana:yellow\n", "utf-8");

    expect(sstable.get("apple")).toBe("red");
    expect(sstable.get("banana")).toBe("yellow");
  });

  test("should return null for a missing key", () => {
    fs.writeFileSync(testFolderPath, "apple:red\nbanana:yellow\n", "utf-8");

    expect(sstable.get("nonexistent")).toBeNull();
  });

  test("should handle large values correctly", () => {
    const largeValue = "x".repeat(1e6);
    fs.writeFileSync(testFolderPath, `big:${largeValue}\n`, "utf-8");

    expect(sstable.get("big")).toBe(largeValue);
  });

  // ---- 4. Tombstone (Deletion Marker) ----
  test("should mark a key as deleted", () => {
    fs.writeFileSync(testFolderPath, "apple:red\nbanana:yellow\n", "utf-8");

    sstable.mark_tombstone("banana");

    const data = fs.readFileSync(testFolderPath, "utf-8");
    expect(data.includes("banana:TOMBSTONE")).toBe(true);
  });

  test("should prevent retrieval of a key marked with a tombstone", () => {
    fs.writeFileSync(testFolderPath, "apple:red\nbanana:yellow\n", "utf-8");

    sstable.mark_tombstone("banana");
    expect(sstable.get("banana")).toBeNull();
  });

  test("should persist tombstone markers across restarts", () => {
    fs.writeFileSync(testFolderPath, "apple:red\nbanana:yellow\n", "utf-8");
    sstable.mark_tombstone("banana");

    const newSSTableInstance = new SSTable(testFolderPath);
    expect(newSSTableInstance.get("banana")).toBeNull();
  });

  // ---- 5. Edge Cases ----
  test("should handle keys with special characters", () => {
    fs.writeFileSync(testFolderPath, "spécial✨:välue🚀\n", "utf-8");
    expect(sstable.get("spécial✨")).toBe("välue🚀");
  });

  test("should handle retrieval after multiple updates", () => {
    fs.writeFileSync(testFolderPath, "apple:red\n", "utf-8");
    sstable.create({
      apple: "green"
    });

    expect(sstable.get("apple")).toBe("green");
  });

  test("should not modify an existing SSTable when calling get()", () => {
    fs.writeFileSync(testFolderPath, "apple:red\n", "utf-8");

    sstable.get("apple");
    const data = fs.readFileSync(testFolderPath, "utf-8");

    expect(data.includes("apple:red")).toBe(true);
  });
});

function getFirstFileDataSync(directory: string): string | null {
  try {
    const files = fs.readdirSync(directory);
    for (const file of files) {
      const filePath = path.join(directory, file);
      if (fs.statSync(filePath).isFile()) {
        return fs.readFileSync(filePath, 'utf8');
      }
    }
    return null;
  } catch (err) {
    console.error('Error:', err);
    return null;
  }
}
