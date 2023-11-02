import * as yup from 'yup'
const usernameSchema = yup
  .string()
  .max(20)
  .matches(/^[a-zA-Z0-9_]*$/)

const emailSchema = yup.string().email().required()

const passwordSchema = yup
  .string()
  .matches(/^(?!.* )/)
  .min(6)
//###############################################################
export const signUpSchema = yup.object({
  body: yup.object({
    username: usernameSchema,
    email: emailSchema,
    displayName: yup.string(),
    about: yup.string(),
    password: passwordSchema,
    role: yup.string(),
  }),
})
export type SignUpBody = yup.InferType<typeof signUpSchema>['body']
//###############################################################
