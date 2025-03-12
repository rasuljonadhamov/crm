import { useEffect, useState } from 'react'
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form'

import Heading from '@/components/shared/heading'
import { Button } from '@/components/ui/button'

import { fetchPrivateData, postData, postData2 } from '@/api/api'

import BidDetails from './bid-form-detail/bid-details'
import BidDate from './bid-form-detail/bid-date'
import TerminalOne from './bid-form-detail/bid-terminal-one'
import Warehouses from './bid-form-detail/bid-warhouses'
import TerminalTwo from './bid-form-detail/bid-terminal-two'
import BidDescribe from './bid-form-detail/bid-describe'
import { ChevronLeft, Loader2 } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Modal } from '@/components/ui/modal'

import type { VehicleProfile } from '@/types'

interface OrganizationData {
    terminals: { id: number; name: string; description: string }[]
    warehouses: { id: number; name: string; description: string }[]
    vehicleProfiles: Pick<VehicleProfile, 'id' | 'name'>[]
    extraServices: { id: number; name: string; description: string }[]
}

interface BidFormData {
    client: string
    loadingType: string
    transportType: string
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
    extraServices: Array<{ id: number; count: number }>
    filingTime: string
    priceNds: number
    recipientOrSender: string
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

const BidsInfoModal = ({
    open,
    handleCloseModal,
    selectedBid,
    onOpenChange
}: {
    open
    handleCloseModal
    selectedBid
    onOpenChange?: any
}) => {
    const [clients, setClients] = useState<{ organizationId: number; organizationName: string }[]>([])
    const [terminals, setTerminals] = useState<{ id: number; name: string; description: string }[]>([])
    const [warehouses, setWarehouses] = useState<{ id: number; name: string; description: string }[]>([])
    const [vehicleProfiles, setVehicleProfiles] = useState<{ id: number; name: string }[]>([])
    const [extraServices, setExtraServices] = useState<{ id: number; name: string; description: string }[]>([])
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [operationType, setOperationType] = useState('')
    const [transportType, setTransportType] = useState('')
    const [isClientSelected, setIsClientSelected] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingAdd, setIsLoadingAdd] = useState(false)
    //@ts-expect-error надо что то сделать
    const [originalData, setOriginalData] = useState({})
    const [isReadOnly, setIsReadOnly] = useState<boolean>(true)
    //@ts-expect-error надо что то сделать
    const [data, setData] = useState<OrganizationData | undefined>(undefined)
    //@ts-expect-error надо что то сделать
    const [isFetched, setIsFetched] = useState(true)
    const [formData, setFormData] = useState({ ...selectedBid })

    const hideTerminal1 = operationType === 'loading' && transportType === 'Вагон'
    const hideTerminal2 = operationType === 'unloading' && transportType === 'Вагон'
    const hideWarehouses = operationType === 'moving'

    console.log('selectedBid', selectedBid)

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

    const {
        handleSubmit,
        setValue,
        getValues,
        reset,
        formState: { errors }
    } = formMethods

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

    useEffect(() => {
        if (selectedBid && Object.keys(selectedBid).length > 0) {
            setIsEdit(true)
            setOriginalData({ ...selectedBid })
            setFormData({ ...selectedBid })
            setIsReadOnly(true)

            if (selectedBid.customer?.organizationId) {
                setValue('recipientOrSender', selectedBid.customer.organizationId.toString())
                handleClientChange(selectedBid.customer.organizationId.toString())
            }

            if (selectedBid.client) {
                setValue('client', selectedBid.client.organizationId.toString())
            }

            setValue('loadingType', selectedBid.loadingMode || '')
            setValue('transportType', selectedBid.cargoType || '')
            setOperationType(selectedBid.loadingMode || '')
            setTransportType(selectedBid.cargoType || '')

            setValue('startDate', selectedBid.loadingDate || '')
            setValue('endDate', selectedBid.endDate || '')
            setValue('filingTime', selectedBid.filingTime || '08:00')

            if (selectedBid.terminal1) {
                setValue('terminal1Id', selectedBid.terminal1.cityId || null)
                setValue('terminal1Name', selectedBid.terminal1.cityName || '')
                setValue('terminal1Address', selectedBid.terminal1.address || '')
            }

            if (selectedBid.terminal2) {
                setValue('terminal2Id', selectedBid.terminal2.cityId || null)
                setValue('terminal2Name', selectedBid.terminal2.cityName || '')
                setValue('terminal2Address', selectedBid.terminal2.address || '')
            }

            if (selectedBid.warehouses?.length) {
                setValue(
                    'warehouses',
                    selectedBid.warehouses.map(wh => ({
                        id: wh.cityId,
                        name: wh.cityName || '',
                        address: wh.address || ''
                    }))
                )
            }

            if (selectedBid.vehicleProfileId) {
                setValue('vehicleProfiles', selectedBid.vehicleProfileId)
            }

            setValue('price', selectedBid.price || 0)
            setValue('priceNds', selectedBid.priceNds || 0)
            setValue('requestPrice', selectedBid.isPriceRequest || false)

            setValue('description', selectedBid.description || '')
            setValue('cargoTitle', selectedBid.cargoTitle || '')
            setValue('vehicleCount', selectedBid.vehicleCount || 1)

            if (selectedBid.extraServices?.length) {
                setValue(
                    'extraServices',
                    selectedBid.extraServices.map(es => ({
                        id: es.id,
                        count: es.count,
                        vehicleProfileId: es.vehicleProfileId || 0
                    }))
                )
            }
        } else {
            reset()
            setIsEdit(false)
            setIsReadOnly(false)
            setValue('requestPrice', false)
        }
    }, [selectedBid, reset, setValue])

    console.log('selectedBid.terminal1:', selectedBid.terminal1)
    console.log('selectedBid.terminal2:', selectedBid.terminal2)
    console.log('selectedBid.warehouses:', selectedBid.warehouses)

    const handleClientChange = async (clientId: string) => {
        setValue('client', clientId)
        try {
            const token = localStorage.getItem('authToken') || ''
            const data = await fetchPrivateData<OrganizationData>(
                `api/v1/organization/?organization_id=${clientId}`,
                token
            )
            console.log('data.extraServices', data.extraServices)

            setTerminals(data.terminals || [])
            setWarehouses(data.warehouses || [])
            setVehicleProfiles(data.vehicleProfiles || [])
            setExtraServices(data.extraServices || [])
            setIsClientSelected(true)
        } catch (error) {
            console.error('Ошибка при загрузке данных организации:', error)
        }
    }

    console.log('formMethods.getValues()', formMethods.getValues())

    const handleSave = async () => {
        const token = localStorage.getItem('authToken')
        const currentFormValues = formMethods.getValues()
        const updatedFields = {
            client: { organizationId: Number.parseInt(currentFormValues.client) },
            loadingMode: currentFormValues.loadingType,
            cargoType: currentFormValues.transportType,
            loadingDate: currentFormValues.startDate,
            endDate: currentFormValues.endDate || null,
            filingTime: currentFormValues.filingTime,
            terminal1: {
                cityId: currentFormValues.terminal1Id,
                cityName: currentFormValues.terminal1Name,
                address: currentFormValues.terminal1Address
            },
            terminal2: {
                cityId: currentFormValues.terminal2Id,
                cityName: currentFormValues.terminal2Name,
                address: currentFormValues.terminal2Address
            },
            warehouses: currentFormValues.warehouses.map(wh => ({
                cityId: wh.id,
                cityName: wh.name,
                address: wh.address
            })),
            vehicleProfileId: currentFormValues.vehicleProfiles,
            price: currentFormValues.price || 0,
            priceNds: currentFormValues.priceNds,
            isPriceRequest: currentFormValues.requestPrice,
            description: currentFormValues.description,
            cargoTitle: currentFormValues.cargoTitle,
            vehicleCount: currentFormValues.vehicleCount,
            extraServices: currentFormValues.extraServices.map(es => ({
                id: es.id,
                //@ts-expect-error надо что то сделать
                vehicleProfileId: es.vehicleProfileId,
                count: es.count
            }))
        }

        try {
            setIsLoading(true)
            await postData2(`api/v1/bids/${selectedBid.id}`, updatedFields, token)
            alert('Заявка успешно обновлена!')
            handleCloseModal()
        } catch (error) {
            console.error('Ошибка при обновлении заявки:', error)
            setErrorMessage('Ошибка при обновлении заявки')
        } finally {
            setIsLoading(false)
        }
    }

    const handleEdit = () => {
        if (formData.client?.organizationId) {
            handleClientChange(formData.client.organizationId.toString())
        }
        setIsFetched(false)
        setIsReadOnly(false)
    }

    useEffect(() => {
        if (data) {
            setIsReadOnly(false)
        }
    }, [data])

    useEffect(() => {
        const subscription = formMethods.watch(value => {
            setFormData(prevData => ({
                ...prevData,
                ...value
            }))
        })

        return () => subscription.unsubscribe()
    }, [formMethods])

    const onSubmit: SubmitHandler<BidFormData> = async data => {
        setIsLoadingAdd(true)
        try {
            setErrorMessage(null)
            const payload = {
                cargoType: data.transportType,
                loadingMode: data.loadingType,
                clientId: Number(data.client),
                startDate: getValues('startDate'),
                slideDayTotal: 0,
                customerId: Number(data.recipientOrSender),
                // terminal1: {
                //     cityId: data.terminal1Id,
                //     cityName: data.terminal1Name,
                //     address: data.terminal1Address
                // },
                // terminal2: {
                //     cityId: data.terminal2Id,
                //     cityName: data.terminal2Name,
                //     address: data.terminal2Address
                // },

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
                //@ts-expect-error надо что то сделать
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
            const token = localStorage.getItem('authToken')
            if (!token) {
                console.error('Не найден токен авторизации')
                return
            }

            const res = await postData('api/v1/bids', payload, token)
            handleCloseModal()
            console.log('res', res)
        } catch (error: any) {
            console.error('Ошибка при создании заявки:', error)

            if (error.response?.status === 404) {
                const detailMessage = error.response.data?.detail
                if (detailMessage?.includes('Destination')) {
                    setErrorMessage(detailMessage)
                }
            }
        } finally {
            setIsLoadingAdd(false)
        }
    }

    const saveAsNew = async () => {
        setIsEdit(false)
        handleSubmit(onSubmit)
    }

    return (
        <Modal
            isOpen={open}
            onClose={handleCloseModal}
            className={'!bg-background !p-0 md:w-[1200px] w-full h-full md:h-[90vh]  flex justify-center'}
        >
            <FormProvider {...formMethods}>
                <ScrollArea className='h-[95dvh] md:h-[87dvh] md:px-6 px-0'>
                    <div className='px-0 md:px-2 xl:h-auto h-screen'>
                        <Heading
                            title={isEdit ? 'Редактировать заявку' : 'Создать новую заявку'}
                            description={''}
                            className='hidden md:block space-y-2 py-0 md:py-4 text-center text-[#fff]'
                        />
                        <div className='flex md:hidden items-center gap-2 bg-primary text-white p-4'>
                            <Button
                                variant='ghost'
                                size='icon'
                                className='hover:bg-white/20'
                                onClick={handleCloseModal}
                            >
                                <ChevronLeft className='h-6 w-6' />
                            </Button>
                            <h2 className='text-lg font-medium'>
                                {isEdit ? 'Редактировать заявку' : 'Создать новую заявку'}
                            </h2>
                        </div>
                        {errorMessage && <div className='text-red-500 text-center py-2'>{errorMessage}</div>}
                        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                            <div className='space-y-4'>
                                <div>
                                    <BidDetails
                                        filteredClients={clients}
                                        vehicleProfiles={vehicleProfiles}
                                        handleClientChange={handleClientChange}
                                        setOperationType={setOperationType}
                                        setTransportType={setTransportType}
                                        isReadOnly={isReadOnly}
                                    />
                                </div>
                                <div className={isClientSelected ? '' : 'opacity-50 pointer-events-none'}>
                                    <div className='bg-slate-300 text-center text-[26px] my-3 py-3'>
                                        <p>Маршрут</p>
                                    </div>
                                    <div className='px-6 md:px-0 flex flex-col gap-6'>
                                        {!hideTerminal1 && (
                                            <TerminalOne terminals={terminals} isReadOnly={isReadOnly} />
                                        )}
                                        {!hideWarehouses && <Warehouses warehouses={warehouses} isReadOnly={isReadOnly}/>}

                                        {!hideTerminal2 && (
                                            <TerminalTwo terminals={terminals} isReadOnly={isReadOnly} />
                                        )}
                                    </div>
                                    <BidDate isReadOnly={isReadOnly} />

                                    {/* @ts-expect-error handle types later */}
                                    <BidDescribe extraServices={extraServices} isReadOnly={isReadOnly} />
                                </div>
                            </div>
                            {errorMessage && <div className='text-red-500 text-center py-2'>{errorMessage}</div>}
                            {Object.keys(errors).length > 0 && (
                                <div className='text-red-500 text-center py-2'>Заполните все обязательные поля</div>
                            )}
                            <div className='flex justify-center h-full md:flex-row flex-col gap-4 px-6 md:px-0 py-6'>
                                <Button
                                    disabled={isReadOnly || isLoading}
                                    onClick={handleSave}
                                    type='button'
                                    className='bg-orange-500 hover:bg-orange-600 text-white'
                                >
                                    {isLoading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : null}
                                    Сохранить изменения
                                </Button>
                                <Button
                                    type='submit'
                                    disabled={isReadOnly || isLoading}
                                    onClick={saveAsNew}
                                    className='bg-orange-500 hover:bg-orange-600 text-white'
                                >
                                    {isLoadingAdd ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : null}
                                    Сохранить заявку как новую
                                </Button>
                                <Button
                                    type='button'
                                    onClick={handleEdit}
                                    disabled={isLoading}
                                    className='bg-orange-500 hover:bg-orange-600 text-white'
                                >
                                    Редактировать
                                </Button>
                            </div>
                        </form>
                    </div>
                </ScrollArea>
            </FormProvider>
        </Modal>
    )
}

export default BidsInfoModal
