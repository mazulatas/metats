export interface IBaseHandler<P> {
  (target: object,...args: any[]): void
}

export interface IConstructorHandler<P> extends IBaseHandler<P> {}

export interface IMethodHandler<P> extends IBaseHandler<P> {
  (target: object, props: P, methodName: string, descriptor: PropertyDescriptor): void
}

export interface IFieldHandler<P> extends IBaseHandler<P> {
  (target: object, props: P, fieldName: string): void
}

export interface IParameterHandler<P> extends IBaseHandler<P> {
  (target: object, props: P, parameterName: string, index: number): void
}
