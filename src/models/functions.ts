
export interface IConstructorDecorationFunction {
  (constructorFunction: Function): any
}

export interface IMethodDecoratorFunction {
  (constructorFunction: any, methodName: string, descriptor?: PropertyDescriptor): void
}

export interface IFieldDecoratorFunction {
  (constructorFunction: any, fieldName: string): void
}
