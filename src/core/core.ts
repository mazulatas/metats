import {
  CONTAINER,
  ICtor,
  IFakeCtor,
  IMetaContainer,
  IMetaContext,
  IMetaHandlerAfterCtorCall,
  IMetaHandlerBeforeCtorCall,
  IMetaHandlerDecorate,
  MetaHandlerCall,
  MetaProps,
  MomentCall,
  MomentCallType,
  ORIGINAL_CTOR,
  PropsMutator, stub
} from '../models'

export function makeConstructorDecorator<P>(
  momentCall: MomentCall.decorate,
  handler: IMetaHandlerDecorate<P>,
  propsMutator?: PropsMutator<P>
): MetaProps<P>

export function makeConstructorDecorator<P>(
  momentCall: MomentCall.afterCallCtor,
  handler: IMetaHandlerAfterCtorCall<P>,
  propsMutator?: PropsMutator<P>
): MetaProps<P>

export function makeConstructorDecorator<P>(
  momentCall: MomentCall.beforeCallCtor,
  handler: IMetaHandlerBeforeCtorCall<P>,
  propsMutator?: PropsMutator<P>
): MetaProps<P>

export function makeConstructorDecorator<P>(
  momentCall: MomentCallType,
  handler: MetaHandlerCall<P>,
  propsMutator: PropsMutator<P> = stub
): MetaProps<P> {
  return ((props: P) => decoratorFactory<P>(momentCall, handler, propsMutator, ctorDeepFactory, props)) as MetaProps<P>
}

export function makeMethodDecorator<P>(
  momentCall: MomentCall.decorate,
  handler: IMetaHandlerDecorate<P>,
  propsMutator?: PropsMutator<P>
): MetaProps<P>

export function makeMethodDecorator<P>(
  momentCall: MomentCall.afterCallCtor,
  handler: IMetaHandlerAfterCtorCall<P>,
  propsMutator?: PropsMutator<P>
): MetaProps<P>

export function makeMethodDecorator<P>(
  momentCall: MomentCall.beforeCallCtor,
  handler: IMetaHandlerBeforeCtorCall<P>,
  propsMutator?: PropsMutator<P>
): MetaProps<P>

export function makeMethodDecorator<P>(
  momentCall: MomentCallType,
  handler: MetaHandlerCall<P>,
  propsMutator: PropsMutator<P> = stub
): MetaProps<P> {
  // @ts-ignore
  return decoratorFactory.bind(this, momentCall, handler, propsMutator, paramsDeepFactory.bind(this, 'methods'))
}

// export function factoryParamDecorator(name: symbol) {
//
// }
//
// export function factoryMethodDecorator(name: symbol) {
//
// }

function decoratorFactory<P>(
  momentCall: MomentCall,
  handler: MetaHandlerCall<P>,
  propsMutator: PropsMutator<P>,
  deepFactory: Function,
  props: P
): Function {
  const params = propsMutator(props)
  return deepFactory.bind(global, momentCall, handler, params)
}

function ctorDeepFactory<P>(
  momentCall: MomentCall,
  handler: MetaHandlerCall<P>,
  props: P,
  cls: ICtor
): Function {
  const ctxCtor = getOriginalCtor(cls)
  const context = getContext(ctxCtor).ctor
  setToContext(context, momentCall, handler, props)
  return getFakeCtx(cls)
}

function paramsDeepFactory<P>(
  containerName: keyof IMetaContainer,
  momentCall: MomentCall,
  handler: MetaHandlerCall<P>,
  props: P,
  proto: object,
  fieldName: string
): void {
  const cls = proto.constructor as IFakeCtor
  const ctxCtor = getOriginalCtor(cls)
  const context = getContext(ctxCtor)
  setMethodContextToCtorContext(context, fieldName, containerName, momentCall, handler, props)
}

function checkFakeCtor(cls: IFakeCtor | ICtor): boolean {
  return !!Reflect.get(cls, ORIGINAL_CTOR)
}

function getOriginalCtor(cls: IFakeCtor | ICtor): ICtor {
  return checkFakeCtor(cls) ? Reflect.get(cls, ORIGINAL_CTOR) : cls
}

function getContext(cls: IFakeCtor | ICtor): IMetaContainer {
  if (!Reflect.get(cls, CONTAINER)) Reflect.set(cls, CONTAINER, { ctor: [], methods: {}, param: {} })
  return Reflect.get(cls, CONTAINER)
}

function getFakeCtx(cls: ICtor): Function {
  const context = getContext(getOriginalCtor(cls))
  resolveCtorDecorate(cls, context)
  resolveMethodsDecorate(cls, context)
  resolveParamsDecorate(cls, context)
  if (checkFakeCtor(cls)) return cls
  const fakeCtor = function (...args: any[]): object {
    const context = getContext(cls)
    resolveCtorAfter(cls, context)
    resolveMethodsAfter(cls, context)
    resolveParamsBefore(cls, context)
    const instance = new cls(...args)
    resolveCtorBefore(instance, context)
    resolveMethodsBefore(instance, context)
    resolveParamsAfter(instance, context)
    return instance
  } as IFakeCtor
  Reflect.set(fakeCtor, ORIGINAL_CTOR, cls)
  fakeCtor.prototype = cls.prototype
  return fakeCtor
}

function setToContext<P>(
  context: IMetaContext[],
  momentCall: MomentCall,
  handler: MetaHandlerCall<P>,
  props: P
): void {
  context.push({ resolved: false, momentCall, handler, props })
}

function setMethodContextToCtorContext<P>(
  context: IMetaContainer,
  fieldName: string,
  containerName: keyof IMetaContainer,
  momentCall: MomentCall,
  handler: MetaHandlerCall<P>,
  props: P
): void {
  if (!Reflect.get(context[containerName], fieldName)) Reflect.set(context[containerName], fieldName, [])
  const ctx: IMetaContext[] = Reflect.get(context[containerName], fieldName)
  setToContext(ctx, momentCall, handler, props)
}

function resolveCtorDecorate(instance: object, context: IMetaContainer): void {
  return resolveCtor(instance, context, MomentCall.decorate)
}

function resolveCtorBefore(instance: object, context: IMetaContainer): void {
  return resolveCtor(instance, context, MomentCall.beforeCallCtor)
}

function resolveMethodsDecorate(instance: object, context: IMetaContainer): void {
  return resolveParam(instance, context, 'methods', MomentCall.decorate)
}

function resolveMethodsBefore(instance: object, context: IMetaContainer): void {
  return resolveParam(instance, context, 'methods', MomentCall.beforeCallCtor)
}

function resolveParamsDecorate(instance: object, context: IMetaContainer): void {
  return resolveParam(instance, context, 'param', MomentCall.decorate)
}

function resolveParamsBefore(instance: object, context: IMetaContainer): void {
  return resolveParam(instance, context, 'param', MomentCall.beforeCallCtor)
}

function resolveCtorAfter(cls: Function, context: IMetaContainer): void {
  return resolveCtor(cls, context, MomentCall.afterCallCtor)
}

function resolveMethodsAfter(instance: object, context: IMetaContainer): void {
  return resolveParam(instance, context, 'methods', MomentCall.afterCallCtor)
}

function resolveParamsAfter(instance: object, context: IMetaContainer): void {
  return resolveParam(instance, context, 'methods', MomentCall.afterCallCtor)
}

function resolveCtor(params: object, context: IMetaContainer, momentCall: MomentCall): void {
  context.ctor.forEach(item => callHandler(params, item, momentCall))
}

function resolveParam(params: object, context: IMetaContainer, containerName: keyof IMetaContainer, momentCall: MomentCall): void {
  Object.keys(context[containerName]).forEach((key) => {
    const items: IMetaContext[] = Reflect.get(context[containerName], key)
    items.forEach(item => callHandler(params, item, momentCall))
  })
}

function callHandler(params: object, item: IMetaContext, momentCall: MomentCall): void {
  if (item.momentCall !== momentCall) return
  if (item.resolved) return
  try {
    item.handler(params, item.props)
    item.resolved = true
  } catch (e) {
    console.error(new Error('error in decorator handler, error:\n'), e)
  }
}
