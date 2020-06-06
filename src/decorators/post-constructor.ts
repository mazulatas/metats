import { makeMethodDecorator } from '../core/core'
import { asyncHandler, callMethod } from '../core/utils'

export const PostConstructor = makeMethodDecorator({ handler: asyncHandler(postConstructorHandler), moment: 'afterCreateInstance' })

function postConstructorHandler(instance: any, _: any, methodName: string) {
  callMethod(instance, methodName)
}
