import { IType } from './type'

export interface IMetaHandlerAfterCtorCall<P> {
  <C>(ctx: C, props: P, fieldName?: string): void
}

export interface IMetaHandlerBeforeCtorCall<P> {
  <C>(ctor: IType<C>, props: P, fieldName?: string): void
}

export interface IMetaHandlerDecorate<P> {
  <C>(ctx: IType<C>, props: P, fieldName?: string): void
}

export type MetaHandlerCall<P> =
  | IMetaHandlerAfterCtorCall<P>
  | IMetaHandlerBeforeCtorCall<P>
  | IMetaHandlerDecorate<P>
