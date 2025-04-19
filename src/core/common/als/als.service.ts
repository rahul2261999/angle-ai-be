import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { ulid } from 'ulid';

// Define a base interface with traceId
interface BaseTraceContext {
  traceId: string;
}

@Injectable()
export class AlsService<T extends BaseTraceContext = BaseTraceContext> {
  private als: AsyncLocalStorage<Map<keyof T, T[keyof T]>>;

  constructor() {
    this.als = new AsyncLocalStorage();
  }

  public runContext(
    data: Map<keyof T, T[keyof T]>,
    cb: () => Promise<void> | void | Record<string, unknown>,
  ): void {
    void this.als.run(data, cb);
  }

  public setData<K extends keyof T>(key: K, value: T[K]): void {
    const store = this.als.getStore();
    if (store) {
      store.set(key, value);
    }
  }

  public getData<K extends keyof T>(key: K): T[K] | undefined {
    const store = this.als.getStore();
    if (!store) return undefined;

    // Type assertion to ensure type compatibility
    return store.get(key) as T[K] | undefined;
  }

  public setTraceId(traceId: string | null = null): void {
    const generatedTraceId = traceId || ulid();
    this.setData('traceId' as keyof T, generatedTraceId as T[keyof T]);
  }

  public getTraceId(): string | undefined {
    return this.getData('traceId');
  }
}
