import { ContextType } from './context-type'

export interface IHandlerCallMoment {
  runtime: 'decorate' | 'beforeCreateInstance' | 'afterCreateInstance' | 'none'
  when?: 'before' | 'after'
  then?: ContextType
  name?: string
}
