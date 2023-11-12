import * as yup from 'yup'

const MAX_FILE_SIZE = 2 * 1024 * 1024

export const fileSchema = yup
  .mixed<FileList>()
  .test('fileSize', 'The file is too large', (value: FileList | undefined) => {
    if (!value || value.length === 0) return true // Pass validation if no file is provided
    return value[0].size <= MAX_FILE_SIZE
  })
  .test(
    'type',
    'Files supported are png or jpeg',
    (value: FileList | undefined) => {
      if (!value || value.length === 0) return true // Pass validation if no file is provided
      return value[0].type === 'image/png' || value[0].type === 'image/jpeg'
    }
  )

export const usernameSchema = yup
  .string()
  .max(20, 'Must be max 20 characters or less')
  .matches(
    /^[a-zA-Z0-9_]*$/,
    'Only letters numbers and underscores are allowed'
  )
export const emailSchema = yup
  .string()
  .email('Please enter a valid email address')
  .required('Email is required')
export const passwordSchema = yup
  .string()
  .matches(/^(?!.* )/, 'Must not contain white spaces')
  .min(6, 'Must be at least 6 characters or more')
export const requiredStringSchema = yup.string().required('Required')
