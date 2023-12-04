import React, { ComponentProps } from 'react'
import { FieldError, UseFormRegisterReturn } from 'react-hook-form'

interface SelectInputFieldProps {
  register: UseFormRegisterReturn
  label?: string
  error?: FieldError
  optionTitle: string
  option: string[]
}

export default function SelectInputField({
  register,
  label,
  error,
  option,
  optionTitle,
  ...props
}: SelectInputFieldProps & ComponentProps<'select'>) {
  return (
    <div className="form-control">
      {label && (
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
      )}

      <select
        className="select select-bordered w-full select-input-md"
        {...register}
        {...props}
        defaultValue={optionTitle}
      >
        <option disabled value="" className="hidden">
          {optionTitle}
        </option>
        {option.map((opt, index) => (
          <option key={index}>{opt} </option>
        ))}
      </select>
      {error && (
        <p className=" mt-2 ml-2 text-sm text-error">{error?.message}</p>
      )}
    </div>
  )
}
