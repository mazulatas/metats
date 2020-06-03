import { makeConstructorDecorator } from '../core/core'
import { MomentCall } from '../models'

export const App = makeConstructorDecorator(MomentCall.decorate, handlerDecoratorApp)

function handlerDecoratorApp(): void {

}
