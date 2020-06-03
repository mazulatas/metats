
export interface IMetaHandlerBeforeCtorCall<P> {
  <C>(ctor: C, props: P, fieldName: string): void
}

export interface IMetaHandlerAfterCtorCall<P> {
  <C>(ctx: C, props: P, fieldName: string): void
}

export interface IMetaHandlerDecorate<P> {
  <C>(ctx: C, props: P, fieldName: string): void
}

export type MetaHandlerCall<P> =
  IMetaHandlerBeforeCtorCall<P>
  | IMetaHandlerAfterCtorCall<P>
  | IMetaHandlerDecorate<P>
