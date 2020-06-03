export enum MomentCall {
  afterCallCtor, beforeCallCtor, decorate
}

export type MomentCallType = MomentCall.afterCallCtor | MomentCall.beforeCallCtor | MomentCall.decorate

export type PropsMutator<P> = (props: P) => P
