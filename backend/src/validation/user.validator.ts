import * as yup from 'yup'
import { objectIdSchema } from '../utils/validators'
const usernameValidator = yup
  .string()
  .max(20)
  .matches(/^[a-zA-Z0-9_]*$/)

const emailValidator = yup.string().email().required()

const passwordValidator = yup
  .string()
  .matches(/^(?!.* )/)
  .min(6)
//###############################################################
// export const singupParamsValidator = yup.object({
//   params: yup.object({
//     verificationCode: yup.string().required(),
//     userId: objectIdSchema.required(),
//   }),
// })
// export type SignupParams = yup.InferType<typeof singupParamsValidator>['params']

//###############################################################
export const signUpSchema = yup.object({
  body: yup.object({
    username: usernameValidator,
    displayName: yup.string(),
    about: yup.string(),
    password: passwordValidator.required(),
    verificationCode: yup.string().required(),
    userId: objectIdSchema.required(),
  }),
})
export type SignUpBody = yup.InferType<typeof signUpSchema>['body']
//###############################################################

export const updateUserValidator = yup.object({
  body: yup.object({
    username: usernameValidator,
    displayName: yup.string().max(20),
    about: yup.string().max(160),
  }),
})

export type UpdateUserBody = yup.InferType<typeof updateUserValidator>['body']

//###############################################################

export const sendRegistrationValidator = yup.object({
  body: yup.object({
    email: emailValidator.required(),
    role: yup.string().required(),
  }),
})
export type SendRegistrationBody = yup.InferType<
  typeof sendRegistrationValidator
>['body']
//###############################################################
export const requestResetPasswordvalidator = yup.object({
  body: yup.object({
    email: emailValidator.required(),
  }),
})
export type RequestResetPasswordBody = yup.InferType<
  typeof requestResetPasswordvalidator
>['body']
//###############################################################

export const resetPasswordValidator = yup.object({
  body: yup.object({
    email: emailValidator.required(),
    password: passwordValidator.required(),
    verificationCode: yup.string().required(),
  }),
})
export type ResetPasswordBody = yup.InferType<
  typeof resetPasswordValidator
>['body']
//###############################################################

export const removeUserValidator = yup.object({
  params: yup.object({
    userId: objectIdSchema.required(),
  }),
})
export type RemoveUserParams = yup.InferType<
  typeof removeUserValidator
>['params']
