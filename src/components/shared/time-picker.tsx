import React, { useState, useEffect } from 'react'
import { format, addMinutes, startOfDay, endOfDay } from 'date-fns'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

interface TimePickerProps {
    value?: string
    onChange: (time: string) => void
    isReadOnly?: boolean
}

const generateTimeOptions = (): string[] => {
    const times: string[] = []
    let current: Date = startOfDay(new Date())
    const endTime: Date = endOfDay(new Date())

    while (current <= endTime) {
        times.push(format(current, 'HH:mm'))
        current = addMinutes(current, 10)
    }

    return times
}

const TimePicker: React.FC<TimePickerProps> = ({ value, onChange, isReadOnly }) => {
    const defaultTime = '09:00'
    const [inputValue, setInputValue] = useState(value || defaultTime)
    const [timeOptions, setTimeOptions] = useState<string[]>([])

    useEffect(() => {
        setTimeOptions(generateTimeOptions())
    }, [])

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    disabled={isReadOnly}
                    variant='outlineSecondary'
                    className='w-full justify-start px-3 py-5 md:px-4 md:py-6 text-base md:text-xl'
                >
                    {inputValue || 'Выберите время'}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56 max-h-48 overflow-auto'>
                {timeOptions.map(time => (
                    <DropdownMenuItem
                        key={time}
                        onSelect={() => {
                            onChange(time)
                            setInputValue(time)
                        }}
                    >
                        {time}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default TimePicker
