import { useCallback } from 'react'

const useNumberFormatter = () => {
    const formatNumber = useCallback((value: number | string) => {
        const [integerPart, decimalPart] = String(value).split('.')
        const formattedInteger = Number(integerPart).toLocaleString('ru-RU').replace(/,/g, ' ')
        return decimalPart && decimalPart !== '0' ? `${formattedInteger}.${decimalPart}` : formattedInteger
    }, [])

    return { formatNumber }
}

export default useNumberFormatter
