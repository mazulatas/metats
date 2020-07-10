import { ICtor } from './ctor'

export interface IFakeCtor extends ICtor {
  (...args: any[]): any
}
