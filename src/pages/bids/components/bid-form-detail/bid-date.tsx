import { useFormContext, useWatch } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Checkbox } from '@/components/ui/checkbox'
import { useEffect } from 'react'
import DatePicker from '@/components/shared/date-picker'
import TimePicker from '@/components/shared/time-picker'

function BidDate({ isReadOnly }: { isReadOnly?: boolean }) {
    const { control, setValue } = useFormContext()
    const startDate = useWatch({ control, name: 'startDate' })
    const enableEndDate = useWatch({ control, name: 'enableEndDate' })

    useEffect(() => {
        if (!enableEndDate) {
            setValue('endDate', '')
        }
    }, [enableEndDate, setValue])

    return (
        <div>
            <div className='bg-slate-300 text-center text-[26px] my-3 py-3'>
                <p>Дата и время подачи</p>
            </div>
            <div className='flex flex-col md:flex-row items-start md:items-center py-6 md:px-0 px-6 '>
                <p className='w-full md:w-1/6  whitespace-nowrap'>Дата подачи</p>
                <div className='flex items-center gap-3'>
                    <FormField
                        control={control}
                        name='startDate'
                        rules={{ required: 'Заполните это поле.' }}
                        render={({ field }) => (
                            <FormItem className='md:w-60 w-full'>
                                <FormControl>
                                    <DatePicker
                                        disabled={isReadOnly}
                                        value={field.value ? new Date(field.value) : undefined}
                                        onChange={date => field.onChange(date?.toISOString().split('T')[0])}
                                        minDate={new Date(new Date().setHours(0, 0, 0, 0))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <h3>по</h3>
                    <FormField
                        control={control}
                        name='enableEndDate'
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Checkbox
                                        disabled={isReadOnly}
                                        checked={field.value}
                                        onCheckedChange={checked => setValue('enableEndDate', checked)}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name='endDate'
                        key={enableEndDate ? 'enabled' : 'disabled'}
                        render={({ field }) => (
                            <FormItem className='md:w-[285px] w-full'>
                                <FormControl>
                                    <DatePicker
                                        value={field.value ? new Date(field.value) : undefined}
                                        onChange={date => field.onChange(date?.toISOString().split('T')[0])}
                                        minDate={
                                            startDate
                                                ? new Date(
                                                      new Date(startDate).setDate(new Date(startDate).getDate() + 1)
                                                  )
                                                : new Date(new Date().setHours(0, 0, 0, 0))
                                        }
                                        disabled={!enableEndDate && isReadOnly}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>

            <div className='flex md:flex-col md:gap-5 gap-0 justify-between'>
                <div className='block md:flex md:my-0 md:px-0 px-6 items-center'>
                    <h1 className='w-full md:w-1/6'>Время подачи</h1>
                    <FormField
                        disabled={isReadOnly}
                        control={control}
                        name='submissionTime'
                        render={({ field }) => (
                            <FormItem className='md:w-60 w-[155px]'>
                                <FormControl>
                                    <TimePicker value={field.value} onChange={field.onChange} isReadOnly={isReadOnly} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className='md:my-0 md:px-0 px-4 block md:flex items-center'>
                    <h1 className='w-full md:w-1/6'>Срок доставки</h1>
                    <div className='flex items-center gap-3'>
                        <FormField
                            control={control}
                            name='termDate'
                            render={({ field }) => (
                                <FormItem className='md:w-60 w-full'>
                                    <FormControl>
                                        <DatePicker
                                            value={field.value ? new Date(field.value) : undefined}
                                            onChange={date => field.onChange(date?.toISOString().split('T')[0])}
                                            minDate={new Date(new Date().setHours(0, 0, 0, 0))}
                                            disabled
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BidDate
