import { ContextType } from './context-type'
import { IHandlerCallMoment } from './handler-call-moment'
import { IBaseHandler } from './handlers'

export interface IResolverContext {
  type: ContextType
  handler: IBaseHandler<any>
  props: () => any
  resolve: boolean
  moment: IHandlerCallMoment
  name?: string
}
