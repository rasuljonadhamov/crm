import { useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Minus, Plus } from 'lucide-react'

interface Client {
    organizationId: number
    organizationName: string
}

interface VehicleProfile {
    id: number
    name: string
}

interface BidDetailsProps {
    filteredClients: Client[]
    vehicleProfiles: VehicleProfile[]
    handleClientChange: (value: string) => void
    setOperationType: (value: string) => void
    setTransportType: (value: string) => void
    isReadOnly?: boolean
}

const BidDetails: React.FC<BidDetailsProps> = ({
    filteredClients,
    vehicleProfiles,
    handleClientChange,
    setOperationType,
    setTransportType,
    isReadOnly
}) => {
    const { control, setValue } = useFormContext()
    const [openClient, setOpenClient] = useState(false)
    const [openRecipient, setOpenRecipient] = useState(false)
    const [searchClient, setSearchClient] = useState('')
    const [searchRecipient, setSearchRecipient] = useState('')

    const filteredClientList = filteredClients.filter(client =>
        client.organizationName.toLowerCase().includes(searchClient.toLowerCase())
    )

    const filteredRecipientList = filteredClients.filter(client =>
        client.organizationName.toLowerCase().includes(searchRecipient.toLowerCase())
    )

    const operationType = useWatch({ control, name: 'loadingType' })

    return (
        <div>
            <h1 className='font-bold whitespace-nowrap mt-20 mb-5 md:mt-0 md:hidden block md:px-0 px-6'>Тип перевозки</h1>
            <div className='flex justify-around flex-row items-start md:items-center gap-0 md:gap-16  mb-6 md:my-6 md:px-0 px-4'>
            <h1 className='font-bold whitespace-nowrap mt-20 md:mt-0 hidden md:block'>Тип перевозки</h1>
                <div className='w-full md-w-auto flex justify-center md:block border p-4 rounded-lg'>
                    <FormField
                        control={control}
                        name='loadingType'
                        rules={{ required: 'Заполните это поле.' }}
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <RadioGroup
                                        disabled={isReadOnly}
                                        onValueChange={value => {
                                            const mappedValue =
                                                value === 'Погрузка'
                                                    ? 'loading'
                                                    : value === 'Выгрузка'
                                                      ? 'unloading'
                                                      : 'moving'
                                            field.onChange(mappedValue)
                                            setOperationType(mappedValue)
                                        }}
                                        value={
                                            field.value === 'loading'
                                                ? 'Погрузка'
                                                : field.value === 'unloading'
                                                  ? 'Выгрузка'
                                                  : field.value === 'moving'
                                                    ? 'Перемещение'
                                                    : undefined
                                        }
                                        defaultValue={field.value}
                                        className='flex flex-col md:flex-row md:gap-6 ml-0 gap-4 md:ml-auto '
                                    >
                                        <FormItem className='flex flex-row-reverse md:flex-row items-center gap-3 md:gap-0 md:justify-normal space-x-3 space-y-0 '>
                                            <FormControl>
                                                <RadioGroupItem value='Погрузка' className='size-8' />
                                            </FormControl>
                                            <FormLabel className='font-normal'>Погрузка</FormLabel>
                                        </FormItem>
                                        <FormItem className='flex flex-row-reverse md:flex-row items-center gap-3 md:gap-0 space-x-3 space-y-0'>
                                            <FormControl>
                                                <RadioGroupItem value='Выгрузка' className='size-8' />
                                            </FormControl>
                                            <FormLabel className='font-normal'>Выгрузка</FormLabel>
                                        </FormItem>
                                        <FormItem className='flex flex-row-reverse md:flex-row items-center gap-3 md:gap-0 space-x-3 space-y-0'>
                                            <FormControl>
                                                <RadioGroupItem value='Перемещение' className='size-8' />
                                            </FormControl>
                                            <FormLabel className='font-normal'>Перемещение</FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className='w-full flex justify-center md:block border p-4 rounded-lg'>
                    <FormField
                        control={control}
                        name='transportType'
                        rules={{ required: 'Заполните это поле.' }}
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <RadioGroup
                                        disabled={isReadOnly}
                                        onValueChange={value => {
                                            const mappedValue = value === 'Контейнер' ? 'container' : 'wagon'
                                            field.onChange(mappedValue)
                                            setTransportType(value)
                                        }}
                                        value={
                                            field.value
                                                ? field.value === 'container'
                                                    ? 'Контейнер'
                                                    : 'Вагон'
                                                : undefined
                                        }
                                        defaultValue={field.value}
                                        className='flex flex-col md:flex-row md:gap-6 gap-4'
                                    >
                                        <FormItem className='flex flex-row items-center gap-0 space-x-3 space-y-0'>
                                            <FormControl>
                                                <RadioGroupItem value='Контейнер' className='size-8 !m-0' />
                                            </FormControl>
                                            <FormLabel className='font-normal'>Контейнер</FormLabel>
                                        </FormItem>
                                        <FormItem className='flex items-center space-x-3 space-y-0'>
                                            <FormControl>
                                                <RadioGroupItem value='Вагон' className='size-8' />
                                            </FormControl>
                                            <FormLabel className='font-normal'>Вагон</FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>

            <Separator className='mb-4' />
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-4 md:px-0 px-6'>
                <FormField
                    disabled={isReadOnly}
                    control={control}
                    name='recipientOrSender'
                    rules={{ required: 'Заполните это поле.' }}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='font-bold text-[18px]'>Заказчик</FormLabel>
                            <Select
                                disabled={isReadOnly}
                                onValueChange={value => {
                                    field.onChange(Number(value))
                                    // @ts-expect-error надо посмотреть
                                    handleClientChange(value, 'recipientOrSender')
                                    setOpenClient(false)
                                }}
                                value={field.value?.toString()}
                                open={openRecipient}
                                onOpenChange={setOpenRecipient}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder='Выберите клиента' />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <div className='p-2'>
                                        <Input
                                            placeholder='Поиск...'
                                            value={searchRecipient}
                                            onChange={e => setSearchRecipient(e.target.value)}
                                            onFocus={() => {
                                                setTimeout(() => setOpenRecipient(true), 300)
                                            }}
                                            onBlur={() => {
                                                setTimeout(() => setOpenRecipient(false), 200)
                                            }}
                                            onKeyDown={e => e.stopPropagation()}
                                        />
                                    </div>
                                    {filteredClientList.map(client => (
                                        <SelectItem
                                            key={client.organizationId}
                                            value={client.organizationId.toString()}
                                        >
                                            {client.organizationName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div>
                    <FormField
                        disabled={isReadOnly}
                        control={control}
                        name='client'
                        rules={{ required: 'Заполните это поле.' }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='font-bold text-[18px]'>
                                    {operationType === 'loading' ? 'Отправитель' : 'Получатель'}
                                </FormLabel>
                                <Select
                                    disabled={isReadOnly}
                                    onValueChange={value => {
                                        field.onChange(Number(value))
                                        setOpenRecipient(false)
                                    }}
                                    value={field.value?.toString()}
                                    open={openClient}
                                    onOpenChange={setOpenClient}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue
                                                placeholder={`Выберите ${operationType === 'loading' ? 'отправителя' : 'получателя'}`}
                                            />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent
                                        position='popper'
                                        side='bottom'
                                        align='start'
                                        className='origin-top-left'
                                    >
                                        <div className='p-2'>
                                            <Input
                                                placeholder='Поиск...'
                                                value={searchRecipient}
                                                onChange={e => setSearchClient(e.target.value)}
                                                onFocus={() => {
                                                    setTimeout(() => setOpenClient(true), 300)
                                                }}
                                                onBlur={() => {
                                                    setTimeout(() => setOpenClient(false), 200)
                                                }}
                                                onKeyDown={e => e.stopPropagation()}
                                            />
                                        </div>
                                        {filteredRecipientList.map(client => (
                                            <SelectItem
                                                key={client.organizationId}
                                                value={client.organizationId.toString()}
                                            >
                                                {client.organizationName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>

            <div className='bg-slate-300 text-center text-[26px]  my-3 py-3'>
                <p>Транспорт</p>
            </div>
            <div className='flex flex-col md:flex-row items-start md:items-center gap-2  my-6 md:px-0 px-6 md:py-0 py-3'>
                <div className='flex gap-3 w-full items-center'>
                    <div className='w-2/3'>
                        <FormField
                            disabled={isReadOnly}
                            control={control}
                            name='vehicleProfiles'
                            rules={{ required: 'Заполните это поле.' }}
                            render={({ field }) => (
                                <FormItem>
                                    <Select
                                        disabled={isReadOnly}
                                        onValueChange={value => {
                                            field.onChange(Number(value))
                                            setValue('vehicleProfiles', Number(value))
                                        }}
                                        value={field.value?.toString()}
                                        required
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Профиль ТС' />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {vehicleProfiles.map(profile => (
                                                <SelectItem key={profile.id} value={profile.id.toString()}>
                                                    {profile.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='w-1/3'>
                        <FormField
                            control={control}
                            name='vehicleCount'
                            defaultValue={1}
                            render={({ field }) => (
                                <div className='flex items-center border rounded-lg overflow-hidden h-[51px] '>
                                    <div className='flex-1 flex items-center justify-center text-xl font-semibold'>
                                        {field.value}
                                    </div>
                                    <div className='flex flex-col border-l'>
                                        <button
                                            disabled={isReadOnly}
                                            type='button'
                                            className='w-6 h-5 flex items-center justify-center hover:bg-gray-200'
                                            onClick={() => field.onChange(field.value + 1)}
                                        >
                                            <Plus size={14} className='text-green-500' />
                                        </button>
                                        <button
                                            disabled={isReadOnly}
                                            type='button'
                                            className='w-6 h-5 flex items-center justify-center hover:bg-gray-200'
                                            onClick={() => field.onChange(Math.max(1, field.value - 1))}
                                        >
                                            <Minus size={14} className='text-yellow-500' />
                                        </button>
                                    </div>
                                </div>
                            )}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BidDetails
