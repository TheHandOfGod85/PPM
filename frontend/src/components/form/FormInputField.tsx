import React, { ComponentProps } from 'react'
import { FieldError, UseFormRegisterReturn } from 'react-hook-form'
interface FormInputFieldProps {
  register: UseFormRegisterReturn
  label?: string
  textarea?: boolean
  error?: FieldError
  isFile?: boolean
}

export default function FormInputField({
  register,
  label,
  textarea,
  error,
  isFile,
  ...props
}: FormInputFieldProps & ComponentProps<'input'> & ComponentProps<'textarea'>) {
  return (
    <div className="form-control w-full">
      {label && (
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
      )}
      {textarea ? (
        <>
          <textarea
            {...register}
            {...props}
            className="textarea textarea-bordered textarea-md"
          ></textarea>
          {error && (
            <p className=" mt-2 ml-2 text-sm textarea-error">
              {error?.message}
            </p>
          )}
        </>
      ) : (
        <>
          <input
            {...register}
            {...props}
            className={
              isFile
                ? 'file-input file-input-bordered file-input-md'
                : 'input input-bordered input-md'
            }
          />
          {error && (
            <p className=" mt-2 ml-2 text-sm text-error">{error?.message}</p>
          )}
        </>
      )}
    </div>
  )
}
