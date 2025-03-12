import * as React from 'react'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import type { DateRange } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface DateRangePickerProps {
    value?: DateRange | undefined
    onChange: (range: DateRange | undefined) => void
    placeholder?: string
    className?: string
}

export function DateRangePicker({ onChange, placeholder = 'Выберите даты', className }: DateRangePickerProps) {
    const [date, setDate] = React.useState<DateRange | undefined>()

    return (
        <div className={cn('grid gap-2', className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id='date'
                        variant={'outlineSecondary'}
                        className={cn('w-full justify-start text-left px-3 py-5 md:px-3 !md:py-6 text-base md:text-xl font-normal', !date && 'text-muted-foreground')}
                    >
                        <CalendarIcon className='mr-2 h-4 w-4' />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                                </>
                            ) : (
                                format(date.from, 'LLL dd, y')
                            )
                        ) : (
                            <span>{placeholder}</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                        initialFocus
                        mode='range'
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={newDate => {
                            setDate(newDate)
                            onChange(newDate)
                        }}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
