import { asyncHandler, callMethod, makeMethodDecorator } from '../core'

export const PostConstructor = makeMethodDecorator({ handler: asyncHandler(postConstructorHandler), moment: 'afterCreateInstance' })

function postConstructorHandler(instance: any, _: any, methodName: string) {
  callMethod(instance, methodName)
}
