import { ContextType } from './context-type'
import { HandlerCallMoment } from './handler-call-moment'
import { IBaseHandler } from './handlers'

export interface IResolverContext {
  type: ContextType
  handler: IBaseHandler<any>
  props: any[]
  resolve: boolean
  moment: HandlerCallMoment
  name?: string
}
