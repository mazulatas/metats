
export interface IConstructorDecorationFunction {
  (constructorFunction: Function): any
}

export interface IMethodDecoratorFunction {
  (constructorFunction: Function, methodName: string, descriptor: PropertyDescriptor): void
}
