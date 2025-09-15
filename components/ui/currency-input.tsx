import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "./input"

export interface CurrencyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  className?: string
  value?: string | number
  onChange?: (value: string) => void
  onValueChange?: (value: number) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  showCurrency?: boolean
  suffix?: string
  placeholder?: string
  allowDecimals?: boolean
  decimalScale?: number
  allowNegative?: boolean
}

// Formata valor para exibição brasileira com vírgula e pontos de milhares
const formatBrazilianCurrency = (value: number | string, showZero: boolean = false): string => {
  const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9,-]/g, '').replace(',', '.')) : value
  
  if (isNaN(numValue) || (!showZero && numValue === 0)) {
    return ''
  }
  
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numValue)
}

// Remove formatação e converte para número
const parseBrazilianCurrency = (value: string): number => {
  if (!value) return 0
  // Remove tudo exceto números, vírgulas e pontos
  const cleaned = value.replace(/[^0-9,.]/g, '')
  // Remove pontos de milhares e substitui vírgula por ponto
  const normalized = cleaned.replace(/\./g, '').replace(',', '.')
  const parsed = parseFloat(normalized)
  return isNaN(parsed) ? 0 : parsed
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, value = '', onChange, onValueChange, onBlur, showCurrency = false, suffix = '', placeholder, defaultValue, allowDecimals = true, decimalScale = 2, allowNegative = true, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState('')
    const [isFocused, setIsFocused] = React.useState(false)

    // Formatar valor para entrada do usuário (máscara durante digitação)
    const formatInputValue = (inputValue: string): string => {
      // Verificar se há sinal de menos
      const isNegative = inputValue.includes('-')
      
      // Remove tudo exceto números
      const numbers = inputValue.replace(/\D/g, '')
      
      if (!numbers) return ''
      
      // Converte para centavos (divide por 100)
      let value = parseInt(numbers) / 100
      
      // Aplicar sinal negativo se necessário
      if (isNegative) {
        value = -value
      }
      
      // Formata com padrão brasileiro
      return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(value)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let inputValue = e.target.value
      
      // Remove o prefixo R$ se presente
      if (inputValue.startsWith('R$ ')) {
        inputValue = inputValue.substring(3)
      }
      
      // Verificar se contém sinal de menos e allowNegative é false
      if (!allowNegative && inputValue.includes('-')) {
        return // Não permitir valores negativos
      }
      
      // Aplicar máscara de formatação
      const formatted = formatInputValue(inputValue)
      
      // Converter para valor numérico e verificar novamente
      const numericValue = parseBrazilianCurrency(formatted)
      
      // Verificar novamente se o valor é negativo e allowNegative é false
      if (!allowNegative && numericValue < 0) {
        return // Não permitir valores negativos
      }
      
      setDisplayValue(formatted)
      onChange?.(numericValue.toString())
      onValueChange?.(numericValue)
    }

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      props.onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      onBlur?.(e)
    }

    // Atualizar displayValue quando value prop mudar
    React.useEffect(() => {
      if (value !== undefined && value !== null && value !== '') {
        const numValue = typeof value === 'string' ? parseFloat(value) : value
        if (!isNaN(numValue)) {
          const formatted = formatBrazilianCurrency(numValue, true)
          setDisplayValue(formatted)
        } else {
          setDisplayValue('')
        }
      } else {
        setDisplayValue('')
      }
    }, [value])

    // Determinar o valor final a ser exibido
    let finalDisplayValue = displayValue
    
    // Adicionar prefixo R$ se necessário
    if (showCurrency && finalDisplayValue) {
      finalDisplayValue = `R$ ${finalDisplayValue}`
    }
    
    // Adicionar sufixo se necessário
    if (suffix && finalDisplayValue) {
      finalDisplayValue = `${finalDisplayValue}${suffix}`
    }
    
    // Se não há valor e não está focado, mostrar placeholder personalizado
    const shouldShowPlaceholder = !finalDisplayValue && !isFocused
    const effectivePlaceholder = shouldShowPlaceholder ? 
      (placeholder || (showCurrency ? 'R$ 0,00' : '0,00')) : 
      undefined

    return (
      <Input
        type="text"
        inputMode="decimal"
        className={className}
        ref={ref}
        value={finalDisplayValue}
        placeholder={effectivePlaceholder}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
    )
  }
)
CurrencyInput.displayName = "CurrencyInput"

export { CurrencyInput }