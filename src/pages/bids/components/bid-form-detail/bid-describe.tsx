import { useFormContext, useWatch } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { useEffect, useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Minus, Plus } from 'lucide-react'

interface ExtraService {
    id: number
    name: string
    price: number
    countIncluded?: number
    maxCount?: number
}

interface Service extends ExtraService {
    count: number
    checked: boolean
}

interface BidDescribeProps {
    extraServices: ExtraService[]
    isReadOnly?: boolean
}

function BidDescribe({ extraServices, isReadOnly }: BidDescribeProps) {
    const { control, setValue, watch } = useFormContext()
    const [services, setServices] = useState<Service[]>([])
    const requestPrice = useWatch({ control, name: 'requestPrice' })

    useEffect(() => {
        if (extraServices.length > 0) {
            setServices(
                extraServices.map(service => ({
                    ...service,
                    count: service.countIncluded || 1,
                    checked: false
                }))
            )
        }
    }, [extraServices])


    useEffect(() => {
        if (extraServices.length > 0) {
            const uniqueServices = Array.from(new Map(extraServices.map(service => [service.id, service])).values())

            setServices(
                uniqueServices.map(service => ({
                    ...service,
                    count: 1,
                    checked: false
                }))
            )
        }
    }, [extraServices])

    const handleCountChange = (index: number, value: number) => {
        setServices(prevServices => {
            return prevServices.map((service, i) => (i === index ? { ...service, count: value } : service))
        })
    }

    const handleCheckboxChange = (index: number) => {
        const updatedServices = [...services]
        updatedServices[index].checked = !updatedServices[index].checked
        updatedServices[index].count = updatedServices[index].checked ? 1 : 1
        setServices(updatedServices)
        updateFormData(updatedServices)
    }

    const updateFormData = updatedServices => {
        setValue(
            'extraServices',
            updatedServices.filter(service => service.checked)
        )
    }

    useEffect(() => {
        if (requestPrice) {
            setValue('price', '')
        }
    }, [requestPrice, setValue])

    const totalSum =
        (watch('price') || 0) +
        services.reduce((acc, service) => acc + (service.checked ? service.count * service.price : 0), 0)

    const formatNumber = (value: string) => {
        const num = value.replace(/\D/g, '')
        return num ? new Intl.NumberFormat('ru-RU').format(Number(num)) : ''
    }

    return (
        <div className='space-y-4  md:block'>
            <div>
                <div className='bg-slate-300 text-center text-[26px] my-3 py-3'>
                    <h1>Финансы</h1>
                </div>
                <h1 className='text-center'>Все цены указаны без НДС</h1>
                <p className='md:hidden block md:px-0 px-6 mt-5 mb-[-8px]'>Цена перевозки</p>

                <div className='flex items-center py-4 justify-between md:px-0 px-6'>
                    <FormField
                        control={control}
                        name='requestPrice'
                        render={({ field }) => (
                            <FormItem className='flex flex-row items-center justify-between space-x-3 space-y-0 w-1/2'>
                                <div className='flex items-center gap-4'>
                                    <FormControl>
                                        <Checkbox
                                            disabled={isReadOnly}
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className='space-y-1 leading-none'>
                                        <FormLabel>Запрос цены</FormLabel>
                                    </div>
                                </div>
                                <p className='hidden md:block whitespace-nowrap !mr-6'>Цена перевозки</p>
                            </FormItem>
                        )}
                    />
                    <div className='flex items-center gap-4 w-1/2 justify-end'>
                        <FormField
                            control={control}
                            name='price'
                            render={({ field }) => (
                                <FormItem className='w-full'>
                                    <FormControl>
                                        <Input
                                            type='text'
                                            placeholder='Цена'
                                            {...field}
                                            value={requestPrice ? '' : formatNumber(field.value?.toString() || '')}
                                            onChange={e => {
                                                const rawValue = e.target.value.replace(/\D/g, '')
                                                field.onChange(rawValue ? Number(rawValue) : '')
                                            }}
                                            disabled={requestPrice}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <div className='space-y-4'>
                    <div className='flex items-center py-4 justify-between bg-secondary md:bg-transparent'>
                        <p className='font-bold md:px-0 px-4'>Доп услуги</p>
                    </div>

                    {services.length === 0 ? (
                        <p className='text-gray-500 md:px-0 px-6'>Нет доступных доп. услуг или же выберите клиента</p>
                    ) : (
                        services.map((service, index) => (
                            <div
                                key={service.id}
                                className='flex items-center justify-between  gap-8 md:gap-4 md:px-0 px-4'
                            >
                                <div className='flex justify-between items-center w-full'>
                                    <div className='flex items-center gap-4 w-1/2'>
                                        <Checkbox
                                            disabled={isReadOnly}
                                            checked={service.checked}
                                            onCheckedChange={() => handleCheckboxChange(index)}
                                        />
                                        <p className='text-base font-bold  w-[60%] md:w-full'>{service.name}</p>
                                    </div>
                                    <div className='flex gap-0 md:gap-7 w-[70%] md:w-full justify-end items-center'>
                                        <div
                                            className={`md:px-0 px-4 ${!service.checked ? 'disabled' : ''}`}
                                            aria-disabled={!service.checked}
                                        >
                                            <div
                                                className={`flex items-center border rounded-lg overflow-hidden w-24 h-[51px] ml-0 md:ml-4 mt-0 ${!service.checked ? 'opacity-50 pointer-events-none' : ''}`}
                                            >
                                                <div className='flex-1 flex items-center justify-center text-xl font-semibold'>
                                                    {service.count}
                                                </div>
                                                <div className='flex flex-col border-l'>
                                                    <button
                                                        type='button'
                                                        className='w-6 h-5 flex items-center justify-center hover:bg-gray-200'
                                                        onClick={() =>
                                                            handleCountChange(
                                                                index,
                                                                Math.min(
                                                                    service.maxCount || Infinity,
                                                                    service.count + 1
                                                                )
                                                            )
                                                        }
                                                        disabled={!service.checked}
                                                    >
                                                        <Plus size={14} className='text-green-500' />
                                                    </button>
                                                    <button
                                                        type='button'
                                                        className='w-6 h-5 flex items-center justify-center hover:bg-gray-200'
                                                        onClick={() =>
                                                            handleCountChange(index, Math.max(1, service.count - 1))
                                                        }
                                                        disabled={!service.checked}
                                                    >
                                                        <Minus size={14} className='text-yellow-500' />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <Input
                                            type='text'
                                            readOnly
                                            value={
                                                service.checked ? (service.count * service.price).toLocaleString() : '0'
                                            }
                                            className='w-1/2 text-center text-blue-600'
                                        />
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                    <div className='flex justify-between items-center gap-2 font-bold text-lg py-4 md:px-0 px-6'>
                        <span className='text-base md:text-xl w-1/2'>Полная стоимость рейса без НДС:</span>{' '}
                        <Input
                            disabled={isReadOnly}
                            type='text'
                            readOnly
                            value={totalSum.toLocaleString()}
                            className='w-1/2 text-center'
                        />
                    </div>
                </div>
            </div>

            <div>
                <div className='md:py-0 py-2 mb-10'>
                    <div className='bg-slate-300 text-center text-[26px]  my-3 py-3'>
                        <p>Груз</p>
                    </div>
                    <div className='md:px-0 px-6'>
                        <FormField
                            control={control}
                            name='cargoTitle'
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isReadOnly}
                                            placeholder='Груз'
                                            {...field}
                                            className='px-6 py-6 shadow-inner drop-shadow-xl'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <div className='md:px-0 px-6 '>
                    <FormField
                        control={control}
                        name='description'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-base md:text-xl'>Комментарии</FormLabel>
                                <FormControl>
                                    <Textarea
                                        disabled={isReadOnly}
                                        placeholder='Комментарии'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
        </div>
    )
}

export default BidDescribe
