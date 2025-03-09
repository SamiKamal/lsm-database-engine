import MemTable from '../'

describe("Memtable", () => {
  let memtable;

  beforeEach(() => {
    memtable = new MemTable(5); // Adjust size limit as needed
  });

  // ---- 1. Initialization ----
  test("should create an empty memtable", () => {
    expect(memtable.size()).toBe(0);
  });

  test("should have a configurable size limit", () => {
    expect(memtable.maxSize).toBe(5);
  });

  // ---- 2. Basic Operations ----
  test("should insert a key-value pair", () => {
    memtable.put("foo", "bar");
    expect(memtable.get("foo")).toBe("bar");
  });

  test("should overwrite an existing key with a new value", () => {
    memtable.put("foo", "bar");
    memtable.put("foo", "baz");
    expect(memtable.get("foo")).toBe("baz");
  });

  test("should return null for missing keys", () => {
    expect(memtable.get("nonexistent")).toBeNull();
  });

  test("should delete a key-value pair", () => {
    memtable.put("foo", "bar");
    expect(memtable.get("foo")).toBe("bar");
    memtable.del("foo");
    expect(memtable.get("foo")).toBeNull();
  });

  test("should not affect other keys when deleting one", () => {
    memtable.put("foo", "bar");
    memtable.put("baz", "qux");
    memtable.del("foo");
    expect(memtable.get("baz")).toBe("qux");
  });

  // ---- 3. Concurrency ----
  test("should handle concurrent writes safely", async () => {
    await Promise.all([
      memtable.put("a", "1"),
      memtable.put("b", "2"),
      memtable.put("c", "3"),
    ]);
    expect(memtable.get("a")).toBe("1");
    expect(memtable.get("b")).toBe("2");
    expect(memtable.get("c")).toBe("3");
  });

  test("should handle concurrent reads and writes safely", async () => {
    memtable.put("x", "y");
    await Promise.all([
      memtable.get("x"),
      memtable.put("z", "w"),
    ]);
    expect(memtable.get("z")).toBe("w");
  });

  // ---- 4. Edge Cases ----
  test("should handle inserting an empty key", () => {
    expect(() => memtable.put("", "value")).toThrow();
  });

  test("should handle inserting a null or undefined value", () => {
    expect(() => memtable.put("key", null)).not.toThrow();
    expect(() => memtable.put("key", undefined)).not.toThrow();
  });

  test("should handle extremely large values", () => {
    const largeValue = "x".repeat(1e6);
    memtable.put("large", largeValue);
    expect(memtable.get("large")).toBe(largeValue);
  });

  test("should support special characters in keys and values", () => {
    memtable.put("spécial✨", "välue🚀");
    expect(memtable.get("spécial✨")).toBe("välue🚀");
  });

  test("should handle duplicate inserts correctly", () => {
    memtable.put("dup", "first");
    memtable.put("dup", "second");
    expect(memtable.get("dup")).toBe("second");
  });
});
