import * as yup from 'yup'
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
export const signUpSchema = yup.object({
  body: yup.object({
    username: usernameValidator,
    email: emailValidator.required(),
    displayName: yup.string(),
    about: yup.string(),
    password: passwordValidator.required(),
    role: yup.string().required(),
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
