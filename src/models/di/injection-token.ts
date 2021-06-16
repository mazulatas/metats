export declare abstract class AbstractInjectionToken<T> {
  public static create<T>(desc: string): AbstractInjectionToken<T>
  public name: string
  protected constructor(desc: string)
}
