import { MomentCall } from './meta'

export interface IMetaContext {
  resolved: boolean
  handler: Function
  momentCall: MomentCall,
  props: any
}
