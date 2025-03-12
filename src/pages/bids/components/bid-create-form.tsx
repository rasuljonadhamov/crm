import { useCallback, useEffect, useState } from 'react'

import { useForm, FormProvider, SubmitHandler } from 'react-hook-form'

import Heading from '@/components/shared/heading'
import { Button } from '@/components/ui/button'

import { fetchPrivateData, postData } from '@/api/api'

import BidDetails from './bid-form-detail/bid-details'
import BidDate from './bid-form-detail/bid-date'
import TerminalOne from './bid-form-detail/bid-terminal-one'
import Warehouses from './bid-form-detail/bid-warhouses'
import TerminalTwo from './bid-form-detail/bid-terminal-two'
import BidDescribe from './bid-form-detail/bid-describe'
import { ChevronLeft, Loader2 } from 'lucide-react'

interface BidFormData {
    client: string
    loadingType: string
    transportType: string
    recipientOrSender: string
    startDate: string
    endDate: string
    terminal1Id: number | null
    terminal1Name: string
    terminal1Address: string
    terminal2Id: number | null
    terminal2Name: string
    terminal2Address: string
    warehouseName: string
    warehouses: any
    warehouseAddress: string
    vehicleProfiles: string | number
    price: number
    description: string
    requestPrice: boolean
    cargoTitle: string
    vehicleCount: number
    submissionTime: string
    extraServices: Array<{ id: number; count: number }>
}

interface ClientData {
    organizationId: number
    organizationName: string
}

interface OrganizationData {
    terminals: { id: number; name: string; description: string }[]
    warehouses: { id: number; name: string; description: string }[]
    vehicleProfiles: { id: number; name: string }[]
    extraServices: { id: number; name: string; description: string }[]
}

const BidCreateForm = ({ modalClose }: { modalClose: () => void }) => {
    const [clients, setClients] = useState<{ organizationId: number; organizationName: string }[]>([])
    const [terminals, setTerminals] = useState<{ id: number; name: string; description: string }[]>([])
    const [warehouses, setWarehouses] = useState<{ id: number; name: string; description: string }[]>([])
    const [vehicleProfiles, setVehicleProfiles] = useState<{ id: number; name: string }[]>([])
    const [extraServices, setExtraServices] = useState<{ id: number; name: string; description: string }[]>([])
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [operationType, setOperationType] = useState('')
    const [transportType, setTransportType] = useState('')
    const [isClientSelected, setIsClientSelected] = useState(false)
    const hideTerminal1 = operationType === 'loading' && transportType === 'Вагон'
    const hideTerminal2 = operationType === 'unloading' && transportType === 'Вагон'
    const hideWarehouses = operationType === 'moving'
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const loadClients = async () => {
            try {
                const token = localStorage.getItem('authToken') || ''
                const data = await fetchPrivateData<ClientData[]>('api/v1/organization/clients', token)
                setClients(data)
            } catch (error) {
                console.error('Ошибка при загрузке клиентов:', error)
            }
        }
        loadClients()
    }, [])

    const formMethods = useForm<BidFormData>({
        defaultValues: {
            client: '',
            loadingType: '',
            transportType: '',
            startDate: '',
            endDate: '',
            terminal1Name: '',
            terminal1Address: '',
            vehicleProfiles: '',
            terminal2Name: '',
            terminal2Address: '',
            warehouseName: '',
            warehouseAddress: '',
            price: 0,
            description: '',
            requestPrice: false,
            extraServices: [],
            warehouses: [{ name: '', address: '' }]
        }
    })

    const resetForm = useCallback(() => {
        formMethods.reset({
            client: '',
            loadingType: '',
            transportType: '',
            startDate: '',
            endDate: '',
            terminal1Id: null,
            terminal1Name: '',
            terminal1Address: '',
            terminal2Id: null,
            terminal2Name: '',
            terminal2Address: '',
            warehouseName: '',
            warehouseAddress: '',
            vehicleProfiles: '',
            price: 0,
            description: '',
            requestPrice: false,
            extraServices: [],
            warehouses: [{ name: '', address: '' }],
            recipientOrSender: '',
            vehicleCount: 1,
            cargoTitle: ''
        })
        setOperationType('')
        setTransportType('')
        setIsClientSelected(false)
    }, [formMethods])

    useEffect(() => {
        resetForm()
    }, [resetForm])

    const {
        handleSubmit,
        setValue,
        getValues,
        formState: { errors }
    } = formMethods

    const handleClientChange = async (clientId: string, field: 'client' | 'recipientOrSender' | any) => {
        setValue(field, clientId)
        if (field === 'recipientOrSender') {
            try {
                const token = localStorage.getItem('authToken') || ''
                const data = await fetchPrivateData<OrganizationData>(
                    `api/v1/organization/?organization_id=${clientId}`,
                    token
                )

                setTerminals(data.terminals || [])
                setWarehouses(data.warehouses || [])
                setVehicleProfiles(data.vehicleProfiles || [])
                setExtraServices(data.extraServices || [])
                setIsClientSelected(true)
            } catch (error) {
                console.error('Ошибка при загрузке данных организации:', error)
            }
        }
    }

    const onSubmit: SubmitHandler<BidFormData> = async data => {
        setIsLoading(true)
        try {
            setErrorMessage(null)
            const payload = {
                cargoType: data.transportType,
                loadingMode: data.loadingType,
                clientId: Number(data.client),
                startDate: getValues('startDate'),
                slideDayTotal: 0,
                customerId: Number(data.recipientOrSender),
                // warehouses: data.warehouses.map(warehouse => ({
                //     cityId: warehouse.id,
                //     cityName: warehouse.name,
                //     address: warehouse.address
                // })),

                isPriceRequest: data.requestPrice,
                price: data.price || 0,
                vehicleProfileId: Number(data.vehicleProfiles),
                vehicleCount: getValues('vehicleCount'),
                cargoTitle: data.cargoTitle,
                loadingTime: getValues('submissionTime') || '09:00',

                extraServices: data.extraServices || [],
                description: data.description
            }
            if (!hideTerminal1) {
                // @ts-expect-error надо настроить
                payload.terminal1 = {
                    cityId: data.terminal1Id,
                    cityName: data.terminal1Name,
                    address: data.terminal1Address
                }
            }
            if (!hideWarehouses) {
                // @ts-expect-error надо настроить
                payload.warehouses = data.warehouses.map(warehouse => ({
                    cityId: warehouse.id,
                    cityName: warehouse.name,
                    address: warehouse.address
                }))
            }

            if (!hideTerminal2) {
                // @ts-expect-error надо настроить
                payload.terminal2 = {
                    cityId: data.terminal2Id,
                    cityName: data.terminal2Name,
                    address: data.terminal2Address
                }
            }
            console.log('Отправка данных:', payload)
            const token = localStorage.getItem('authToken')
            if (!token) {
                console.error('Не найден токен авторизации')
                return
            }
            // @ts-expect-error надо исправить
            const res = await postData('api/v1/bids', payload, token)
            modalClose()
            // console.log('res', res)
        } catch (error: any) {
            console.error('Ошибка при создании заявки:', error)

            if (error.response?.status === 404) {
                const detailMessage = error.response.data?.detail
                if (detailMessage?.includes('Destination') || detailMessage?.includes('Direction not found')) {
                    setErrorMessage('Такое направление не существует')
                }
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <FormProvider {...formMethods}>
            <div className='px-0 md:px-2'>
                <Heading
                    title={'Создать новую заявку'}
                    description={''}
                    className='hidden md:block space-y-2 py-0 md:py-4 text-center text-[#fff]'
                />
                <div className='fixed w-full top-0 z-10 flex md:hidden items-center gap-2 bg-primary text-white p-4'>
                    <Button variant='ghost' size='icon' className='hover:bg-white/20' onClick={modalClose}>
                        <ChevronLeft className='h-6 w-6' />
                    </Button>
                    <h2 className='text-lg font-medium'>Создать новую заявку</h2>
                </div>
                {errorMessage && <div className='text-red-500 text-center py-2'>{errorMessage}</div>}
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-4' autoComplete='off'>
                    <div className='space-y-4'>
                        <div>
                            <BidDetails
                                filteredClients={clients}
                                vehicleProfiles={vehicleProfiles}
                                /* @ts-expect-error надо что то сделать */
                                handleClientChange={handleClientChange}
                                setOperationType={setOperationType}
                                setTransportType={setTransportType}
                            />
                        </div>
                        <div className={isClientSelected ? '' : 'opacity-50 pointer-events-none'}>
                            <div className='bg-slate-300 text-center text-[26px]  my-3 py-3'>
                                <p>Маршрут</p>
                            </div>
                            <div className='px-4 md:px-0 flex flex-col gap-6'>
                                {!hideTerminal1 && <TerminalOne terminals={terminals} />}
                                {!hideWarehouses && <Warehouses warehouses={warehouses} />}
                                {!hideTerminal2 && <TerminalTwo terminals={terminals} />}
                            </div>
                            <BidDate />

                            {/* @ts-expect-error что нибудь придумаем */}
                            <BidDescribe extraServices={extraServices} />
                        </div>
                    </div>
                    <div>
                        {Object.keys(errors).length > 0 && (
                            <div className='text-red-500 text-center py-2'>Заполните все обязательные поля</div>
                        )}
                    </div>
                    <div>{errorMessage && <div className='text-red-500 text-center py-2'>{errorMessage}</div>}</div>
                    <div className='flex flex-col-reverse md:grid md:grid-cols-2 gap-4'>
                        <Button type='button' variant='secondary' size='lg' onClick={modalClose} disabled={isLoading}>
                            Отмена
                        </Button>
                        <Button variant='tertiary' type='submit' size='lg' disabled={!isClientSelected || isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className='animate-spin mr-2 h-5 w-5' />
                                    Отправка...
                                </>
                            ) : (
                                'Создать заявку'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </FormProvider>
    )
}

export default BidCreateForm
