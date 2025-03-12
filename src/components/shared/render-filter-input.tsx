// import { useEffect } from 'react'
import { DateRangePicker } from './range-picker'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// import { useFilter } from '@/context/filter-context'

export function FilterInput({ column, handleFilterChange }) {
    // const { pageType } = useFilter()

    const handleChange = value => {
        column.setFilterValue(value)
        handleFilterChange(column.id, value)
    }

    const getStringValue = (value: string | string[] | null): string => {
        if (Array.isArray(value)) {
            return value.join(',')
        }
        return value ?? ''
    }

    switch (column.columnDef.filterType) {
        case 'exact':
            return (
                <Input
                    value={(column.getFilterValue() as string) ?? ''}
                    onChange={e => handleChange(e.target.value)}
                    placeholder='Точное совпадение'
                    className='text-xs min-w-16 h-7 bg-white'
                />
            )
        case 'select':
            return (
                <Select
                    value={getStringValue(column.getFilterValue())}
                    onValueChange={value => {
                        const selectedOption = column.columnDef.filterOptions?.find(option =>
                            Array.isArray(option.value) ? option.value.join(',') === value : option.value === value
                        )
                        const newValue = selectedOption ? selectedOption.value : []
                        column.setFilterValue(newValue)
                        handleFilterChange(column.id, newValue)
                    }}
                >
                    <SelectTrigger className='text-xs min-w-full h-7 bg-white'>
                        <SelectValue placeholder='Выберите' />
                    </SelectTrigger>
                    <SelectContent>
                        {column.columnDef.filterOptions?.map(option => (
                            <SelectItem
                                key={Array.isArray(option.value) ? option.value.join(',') : option.value}
                                value={Array.isArray(option.value) ? option.value.join(',') : option.value}
                            >
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )
        case 'dateRange':
            return (
                <DateRangePicker
                    value={column.getFilterValue() as { from: Date; to?: Date } | undefined}
                    onChange={range => handleChange(range)}
                    placeholder='Дата'
                    className='text-xs'
                />
            )
        case 'fuzzy':
            return (
                <Input
                    value={(column.getFilterValue() as string) ?? ''}
                    onChange={e => handleChange(e.target.value)}
                    placeholder='Поиск...'
                    className='text-xs h-7 min-w-16 bg-white'
                />
            )
        case 'range':
            return <button className='text-xs h-7 bg-white px-2'>{column.columnDef.header}</button>
        default:
            return null
    }
}
