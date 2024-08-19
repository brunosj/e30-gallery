import React from 'react'
import { FieldValues, UseFormRegister, Validate } from 'react-hook-form'
import * as m from '@/paraglide/messages.js'
import cn from 'classnames'

import classes from './index.module.css'

type Props = {
  name: string
  label: string
  register: UseFormRegister<FieldValues & any>
  required?: boolean
  error: any
  type?: 'text' | 'number' | 'password' | 'email' | 'firstName' | 'lastName'
  validate?: (value: string) => boolean | string
}

export const Input: React.FC<Props> = ({
  name,
  label,
  required,
  register,
  error,
  type = 'text',
  validate,
}) => {
  return (
    <div className={classes.inputWrap}>
      <label htmlFor="name" className={classes.label}>
        {`${label} ${required ? '' : ''}`}
      </label>
      <input
        className={cn(classes.input, error && classes.error)}
        {...{ type }}
        {...register(name, {
          required,
          validate,
          ...(type === 'email'
            ? {
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: `${m.pleaseEnterValidEmail()}`,
                },
              }
            : {}),
        })}
      />
      {error && (
        <div className={classes.errorMessage}>
          {!error?.message && error?.type === 'required' ? `${m.requiredField()}` : error?.message}
        </div>
      )}
    </div>
  )
}
