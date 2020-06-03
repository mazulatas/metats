import { IHashMap } from './hashMap'
import { IMetaContext } from './meta-context'

export interface IMetaContainer {
  ctor: IMetaContext[]
  methods: IHashMap<IMetaContext[]>
  param: IHashMap<IMetaContext[]>
}
