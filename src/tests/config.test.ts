import Config from '../Config';

describe('Config', () => {
  let config: Config;

  beforeEach(() => {
    config = new Config();
  });

  it('should set and get a value', () => {
    config.set('key', 'value');
    expect(config.get('key')).toBe('value');
  });

  it('should return undefined for non-existent key', () => {
    expect(config.get('nonExistentKey')).toBeUndefined();
  });

  it('should throw an error for non-existent key when using getOrThrow', () => {
    expect(() => config.getOrThrow('nonExistentKey')).toThrow();
  });

  it('should return a number for getInt', () => {
    config.set('key', '5');
    expect(config.getInt('key')).toBe(5);
  });

  it('should return a boolean for getBoolean', () => {
    config.set('key', 'true');
    expect(config.getBoolean('key')).toBe(true);
  });
});
