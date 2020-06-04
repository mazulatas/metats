import { IHandlerCallMoment } from './handler-call-moment'
import { IBaseHandler } from './handlers'
import { PropsMutator } from './props-mutator'

export interface IParamsDecoratorMaker<H extends IBaseHandler<P>, P> {
  handler: H
  moment?: IHandlerCallMoment
  name?: string
  propsMutator?: PropsMutator<P>
}
