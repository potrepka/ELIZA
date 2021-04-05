export class LRU<T, U> {
  store: Map<T, U>;
  max: number;

  constructor(max: number = Infinity) {
    this.store = new Map<T, U>();
    this.max = max;
  }

  get(key: T) {
    const item = this.store.get(key);
    if (item) {
      this.store.delete(key);
      this.store.set(key, item);
    }
    return item;
  }

  set(key: T, item: U) {
    if (this.store.has(key)) {
      this.store.delete(key);
    } else if (this.store.size == this.max) {
      this.store.delete(this.store.keys().next().value);
    }
    this.store.set(key, item);
  }
}