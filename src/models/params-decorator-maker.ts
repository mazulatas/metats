import { HandlerCallMoment } from './handler-call-moment'
import { IBaseHandler } from './handlers'
import { PropsMutator } from './props-mutator'

export interface IParamsDecoratorMaker<H extends IBaseHandler<P>, P> {
  handler: H
  moment?: HandlerCallMoment
  name?: string
  propsMutator?: PropsMutator<P>
}
