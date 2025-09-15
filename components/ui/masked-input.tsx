"use client"

import React, { forwardRef, useState } from "react"
import { Input } from "./input"
import { cn } from "@/lib/utils"
import { isValidCPFOrCNPJ } from "@/lib/masks"

interface MaskedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  mask: string
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
}

const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ mask, value = "", onChange, className, defaultValue, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState(value)

    const applyMask = (inputValue: string, maskPattern: string) => {
      const cleanValue = inputValue.replace(/\D/g, '')
      let maskedValue = ''
      let valueIndex = 0

      for (let i = 0; i < maskPattern.length && valueIndex < cleanValue.length; i++) {
        if (maskPattern[i] === '9') {
          maskedValue += cleanValue[valueIndex]
          valueIndex++
        } else {
          maskedValue += maskPattern[i]
        }
      }

      return maskedValue
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      const maskedValue = applyMask(inputValue, mask)
      setDisplayValue(maskedValue)
      
      if (onChange) {
        // Retorna apenas os números para o onChange
        const cleanValue = inputValue.replace(/\D/g, '')
        onChange(cleanValue)
      }
    }

    React.useEffect(() => {
      if (value !== undefined) {
        const maskedValue = applyMask(value, mask)
        setDisplayValue(maskedValue)
      }
    }, [value, mask])

    return (
      <Input
        {...props}
        ref={ref}
        value={displayValue}
        onChange={handleChange}
        className={cn(className)}
      />
    )
  }
)

MaskedInput.displayName = "MaskedInput"

// Componente específico para CNPJ/CPF
interface CnpjCpfInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: string
  onChange?: (value: string) => void
  onValidationChange?: (isValid: boolean) => void
}

const CnpjCpfInput = forwardRef<HTMLInputElement, CnpjCpfInputProps>(
  ({ value = "", onChange, onValidationChange, defaultValue, className, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState(() => {
      const initialValue = String(value || defaultValue || "")
      return formatCnpjCpf(initialValue)
    })
    const [isValid, setIsValid] = useState(false)
    const [hasBlurred, setHasBlurred] = useState(false)

    function formatCnpjCpf(inputValue: string) {
      const cleanValue = inputValue.replace(/\D/g, '')
      
      if (cleanValue.length <= 11) {
        // CPF: 999.999.999-99
        return cleanValue
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      } else {
        // CNPJ: 99.999.999/9999-99
        return cleanValue
          .replace(/(\d{2})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1/$2')
          .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
      }
    }

    const validateDocument = (document: string) => {
      const cleanDocument = document.replace(/\D/g, '')
      if (cleanDocument.length === 0) {
        setIsValid(false)
        onValidationChange?.(false)
        return
      }
      
      const valid = isValidCPFOrCNPJ(document)
      setIsValid(valid)
      onValidationChange?.(valid)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      const formattedValue = formatCnpjCpf(inputValue)
      setDisplayValue(formattedValue)
      
      // Valida em tempo real para garantir que o estado seja sempre atualizado
      validateDocument(formattedValue)
      
      if (onChange) {
        onChange(formattedValue)
      }
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setHasBlurred(true)
      validateDocument(displayValue)
      props.onBlur?.(e)
    }

    React.useEffect(() => {
      if (value !== undefined) {
        const formattedValue = formatCnpjCpf(String(value))
        setDisplayValue(formattedValue)
      }
    }, [value])

    React.useEffect(() => {
      if (defaultValue !== undefined) {
        const formattedValue = formatCnpjCpf(String(defaultValue))
        setDisplayValue(formattedValue)
      }
    }, [defaultValue])

    return (
      <div className="relative">
        <Input
          {...props}
          ref={ref}
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="00.000.000/0000-00 ou 000.000.000-00"
          maxLength={18}
          className={cn(
            className,
            hasBlurred && !isValid && displayValue.replace(/\D/g, '').length > 0 && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
            hasBlurred && isValid && displayValue.replace(/\D/g, '').length > 0 && "border-green-500 focus:border-green-500 focus:ring-green-500/20"
          )}
        />
        {hasBlurred && !isValid && displayValue.replace(/\D/g, '').length > 0 && (
          <div className="absolute -bottom-5 left-0 text-xs text-red-500">
            CPF/CNPJ inválido
          </div>
        )}
        {hasBlurred && isValid && displayValue.replace(/\D/g, '').length > 0 && (
          <div className="absolute -bottom-5 left-0 text-xs text-green-500">
            ✓ Válido
          </div>
        )}
      </div>
    )
  }
)

CnpjCpfInput.displayName = "CnpjCpfInput"

// Componente específico para telefone
interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: string
  onChange?: (value: string) => void
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value = "", onChange, defaultValue, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState(() => {
      const initialValue = String(value || defaultValue || "")
      return formatPhone(initialValue)
    })

    function formatPhone(inputValue: string) {
      const cleanValue = inputValue.replace(/\D/g, '')
      
      if (cleanValue.length <= 10) {
        // Telefone fixo: (99) 9999-9999
        return cleanValue
          .replace(/(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{4})(\d{1,4})$/, '$1-$2')
      } else {
        // Celular: (99) 99999-9999
        return cleanValue
          .replace(/(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{5})(\d{1,4})$/, '$1-$2')
      }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      const formattedValue = formatPhone(inputValue)
      setDisplayValue(formattedValue)
      
      if (onChange) {
        onChange(formattedValue)
      }
    }

    React.useEffect(() => {
      if (value !== undefined) {
        const formattedValue = formatPhone(String(value))
        setDisplayValue(formattedValue)
      }
    }, [value])

    React.useEffect(() => {
      if (defaultValue !== undefined) {
        const formattedValue = formatPhone(String(defaultValue))
        setDisplayValue(formattedValue)
      }
    }, [defaultValue])

    return (
      <Input
        {...props}
        ref={ref}
        value={displayValue}
        onChange={handleChange}
        placeholder="(11) 99999-9999"
        maxLength={15}
      />
    )
  }
)

PhoneInput.displayName = "PhoneInput"

export { MaskedInput, CnpjCpfInput, PhoneInput }