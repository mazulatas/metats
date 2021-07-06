import { ContextType } from './context-type'
import { IParamsDecoratorMaker } from './params-decorator-maker'

export interface IMetaFactory<P> {
  params: IParamsDecoratorMaker<any, P>[]
  type: ContextType
}

export interface IMetaFactoryProps<P, R = any> extends IMetaFactory<P> {
  (props: P): R
}

export interface IMetaFactoryNoProps<R = any> extends IMetaFactory<unknown> {
  (): R
}

export type MetaFactory<P, R> = unknown extends P ? IMetaFactoryNoProps<R> : IMetaFactoryProps<P, R>
