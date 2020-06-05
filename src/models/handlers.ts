export interface IBaseHandler {
  (target: object,...args: any[]): void
}

export interface IConstructorHandler<P> extends IBaseHandler {}

export interface IMethodHandler<P> extends IBaseHandler {
  (target: object, props: P, methodName: string, descriptor: PropertyDescriptor): void
}

export interface IFieldHandler<P> extends IBaseHandler {
  (target: object, props: P, fieldName: string): void
}

export interface IParameterHandler<P> extends IBaseHandler {
  (target: object, props: P, parameterName: string, index: number): void
}
