import { AsyncLocalStorage } from 'async_hooks';
import { v4 } from 'uuid';

interface ContextStore {
  [key: string]: any;
}

class AsyncContextStore {
  private static instance: AsyncContextStore;
  private asyncLocalStorage: AsyncLocalStorage<Map<string, any>>;

  private constructor() {
    this.asyncLocalStorage = new AsyncLocalStorage();
  }

  public static getInstance(): AsyncContextStore {
    if (!AsyncContextStore.instance) {
      AsyncContextStore.instance = new AsyncContextStore();
    }
    return AsyncContextStore.instance;
  }

  /**
   * Creates a new store with data.
   * @param data - The initial data to be stored in the context store.
   * default generates the unique tracing id
   */
  public runContext(data: ContextStore, cb: Function): void {
    this.asyncLocalStorage.run(new Map(Object.entries(data)), () => {
      cb()
    });
  }

  public getStore() {
    return this.asyncLocalStorage.getStore();
  }

  /**
   * Sets a value in the current store using a specific key.
   * @param key - The key where the data should be stored.
   * @param value - The value to be stored.
   */
  public setData(key: string, value: any): void {
    const store = this.asyncLocalStorage.getStore();
    if (store) {
      store.set(key, value);
    } 
  }

  /**
   * Gets a value from the current store using a specific key.
   * @param key - The key for which to retrieve the value.
   * @returns The value associated with the key, or null if not found.
   */
  public getData(key: string): any {
    const store = this.asyncLocalStorage.getStore();
    return store ? store.get(key) : null;
  }

  /**
   * Sets the traceId for the current request. If no traceId is provided, generates a new one.
   * @param traceId - The traceId to be set. If not provided, a new one will be generated.
   */
  public setTraceId(traceId: string | null = null): void {
    const generatedTraceId = traceId || v4();
    this.setData('traceId', generatedTraceId);
  }

  /**
   * Gets the traceId from the current request context.
   * @returns The traceId or null if not found.
   */
  public getTraceId(): string | null {
    return this.getData('traceId');
  }
}

const asyncContextStore = AsyncContextStore.getInstance()

export { asyncContextStore };
