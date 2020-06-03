export interface IMeta<P> {
  (props: P): any
}

export interface IMetaNoProps {
  (): any
}

export type MetaProps<P> = unknown extends P ? IMetaNoProps : IMeta<P>
