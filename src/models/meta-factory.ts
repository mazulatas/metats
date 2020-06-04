export type MetaFactoryProps<P, R = any> = (props: P) => R

export type MetaFactoryNoProps<R = any> = () => R

export type MetaFactory<P, R> = unknown extends P ? MetaFactoryNoProps<R> : MetaFactoryProps<P, R>
