import React, { ComponentProps, useState } from 'react'
import { FieldError, UseFormRegisterReturn } from 'react-hook-form'
import FormInputField from './FormInputField'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

interface PasswordInputFieldProps {
  register: UseFormRegisterReturn
  label?: string
  error?: FieldError
}

export default function PasswordInputField({
  register,
  label,
  error,
  ...props
}: PasswordInputFieldProps &
  ComponentProps<'input'> &
  ComponentProps<'textarea'>) {
  const [showpassword, setShowPassword] = useState(false)
  return (
    <FormInputField
      register={register}
      label={label}
      error={error}
      {...props}
      type={showpassword ? 'text' : 'password'}
      inputGroupElement={
        <button
          type="button"
          id={register.name + '-toggle-visibility-button'}
          className="btn"
          onClick={() => setShowPassword(!showpassword)}
        >
          {showpassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      }
    />
  )
}
