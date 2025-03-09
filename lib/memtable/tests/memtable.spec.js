import MemTable from '../';

describe('MemTable', () => {
  let memtable;

  beforeEach(() => {
    memtable = new MemTable();
  });

  test('should store and retrieve a key-value pair', () => {
    memtable.put('user:001', { name: 'Alice' });
    expect(memtable.get('user:001')).toEqual({ name: 'Alice' });
  });

  test('should return undefined for a non-existent key', () => {
    expect(memtable.get('user:999')).toBeUndefined();
  });

  test('should delete a key', () => {
    memtable.put('user:001', { name: 'Alice' });
    memtable.del('user:001');
    expect(memtable.get('user:001')).toBeUndefined();
  });
});

