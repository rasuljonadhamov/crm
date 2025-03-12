import { useMemo } from 'react'

import { ColumnDef } from '@tanstack/react-table'

import useNumberFormatter from '@/hooks/use-format-number'

import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Loader2 } from 'lucide-react'

interface Bid {
    _id: string
    persistentId: string
    cargoTitle: string
    clientName: { organizationName: string }
    price: number | null
    status: string | null
    filingTime: string
    createdBy: string
    createdAt: string
    isPriceRequest?: boolean
    customerName?: { organizationName: string }
    carrier?: { organizationName: string }
    terminal1?: { cityName: string }
    terminal2?: { cityName: string }
    warehouses?: { cityName: string }[]
    vehicleProfile?: { name: string }
    loadingDate: number
    activationTime: string
    cargoType?: 'wagon' | 'container'
    loadingMode?: 'loading' | 'unloading'
    auction?: number
    bestSalePrice?: number
    extraServicesPrice?: number
    fullPrice?: number
    commission?: number
    buyBid?: {
        persistentId?: string
        loadingMode: string
        cargoType: string
        loadingDate: number
        terminal1: { cityName: string }
        terminal2: { cityName: string }
        warehouses: Array<{ cityName: string }>
        vehicleProfile: { name: string }
        filingTime: string
        customer?: { organizationName: string }
        author?: { fio: string }
        client: { organizationName: string }
    }
    saleBid?: {
        author?: { fio: string }
    }
    driverUser?: {
        fio: string
    }
    assignedVehicle?: {
        docModel: string
        plateNum: string
    }
    assignedTrailer?: {
        docModel?: string
        plateNum: string
    }
    statusUpdatedUser?: {
        username: string
        fio: string
    }
    docSubmissionUser?: {
        fio: string
    }
    docSubmissionDate?: string

    [key: string]: unknown
}

interface ColumnsProps {
    isMobile?: boolean
    isShortTable: boolean
    onApprove: (bidId: string) => void
    onDelete: (bidId: string) => void
    onOpenModal: (bid: any) => void
}

export const useOrdersTableColumns = ({ isShortTable, onApprove, onDelete, onOpenModal, isMobile }: ColumnsProps) => {
    const { formatNumber } = useNumberFormatter()
    return useMemo<ColumnDef<Bid>[]>(() => {
        const allColumns: (ColumnDef<Bid> & {
            isShortVersion?: boolean
            searchable?: boolean
            filterType?: string
            filterOptions?: { value: string | string[]; label: string }[]
            accessorFn?: any
            isMobile?: boolean
        })[] = [
            {
                accessorKey: 'id',
                header: 'ID',
                minSize: 100,
                maxSize: 500,
                size: 200,
                isShortVersion: false,
                searchable: true,
                filterType: 'exact',
                enableResizing: true,
                isMobile: false
            },
            {
                accessorKey: 'persistentId',
                header: 'ЦМ ID',
                accessorFn: (row: Bid) => row.buyBid?.persistentId ?? '—',
                size: 100,
                minSize: 100,
                maxSize: 500,
                isShortVersion: false,
                searchable: true,
                filterType: 'exact',
                enableResizing: true,
                isMobile: false
            },
            {
                header: 'Вагон/Конт',
                accessorKey: 'cargoType',
                size: 200,
                minSize: 100,
                maxSize: 500,
                accessorFn: row => {
                    let cargoTypeLabel = ''
                    if (row.buyBid?.cargoType === 'wagon') {
                        cargoTypeLabel = 'Вагон'
                    } else if (row.buyBid?.cargoType === 'container') {
                        cargoTypeLabel = 'Контейнер'
                    }
                    return ` ${cargoTypeLabel}`
                },

                searchable: true,
                filterType: 'select',
                enableResizing: true,
                filterOptions: [
                    { value: ['wagon', 'container'], label: 'Все' },
                    { value: 'wagon', label: 'Вагон' },
                    { value: 'container', label: 'Контейнер' }
                ]
            },
            {
                accessorKey: 'loadingMode',
                header: 'Операция',
                size: 100,
                minSize: 100,
                maxSize: 500,
                accessorFn: row => {
                    let loadingModeLabel = ''
                    if (row.loadingMode === 'loading') {
                        loadingModeLabel = 'Погрузка'
                    } else {
                        loadingModeLabel = 'Выгрузка'
                    }

                    return `${loadingModeLabel}`
                },
                searchable: true,
                filterType: 'select',
                filterOptions: [
                    { value: ['loading', 'unloading', 'moving'], label: 'Все' },
                    { value: 'loading', label: 'Погрузка' },
                    { value: 'unloading', label: 'Выгрузка' },
                    { value: 'moving', label: 'Перемещение ' }
                ]
            },
            {
                accessorKey: 'loadingDate',
                header: 'Дата подачи',
                size: 120,
                minSize: 100,
                maxSize: 500,
                isShortVersion: true,
                searchable: true,
                accessorFn: row =>
                    row.buyBid?.loadingDate
                        ? format(new Date(row.buyBid.loadingDate), 'dd.MM.yyyy', { locale: ru })
                        : '—',
                filterType: 'dateRange',
                isMobile: true
            },
            {
                accessorKey: 'terminal1',
                header: 'Терминал 1',
                size: 120,
                accessorFn: row => row.buyBid?.terminal1?.cityName ?? '—',
                isShortVersion: true,
                searchable: true,
                filterType: 'fuzzy',
                isMobile: true
            },
            {
                accessorKey: 'warehouses',
                header: 'Склад',
                size: 120,
                accessorFn: row => row.buyBid?.warehouses?.[0]?.cityName ?? '—',
                isShortVersion: true,
                searchable: true,
                filterType: 'fuzzy',
                isMobile: true
            },
            {
                accessorKey: 'terminal2',
                header: 'Терминал 2',
                isShortVersion: true,
                size: 120,
                accessorFn: row => row.buyBid?.terminal2?.cityName ?? '—',
                searchable: true,
                filterType: 'fuzzy',
                isMobile: true
            },
            {
                accessorKey: 'vehicleProfile',
                header: 'Профиль ТС',
                size: 150,
                accessorFn: row => row.buyBid?.vehicleProfile?.name ?? '—',
                isShortVersion: true,
                searchable: true,
                filterType: 'fuzzy'
            },
            {
                accessorKey: 'status',
                header: 'Статус',
                size: 100,
                accessorFn: row => row.status ?? null,
                cell: ({ row }) => {
                    const statusMap = {
                        cancelledByCustomer: 'Отменено клиентом',
                        new: 'Новый',
                        executed: 'Выполнена',
                        canceled: 'Отменена',
                        canceledByCarrierWithPenalty: 'Отменяется перевозчиком (половина ГО)',
                        canceledByCustomerWithPenalty: 'Отменяется заказчиком (половина ГО)',
                        canceledByCarrier: 'Отменяется перевозчиком',
                        failed: 'Сорван',
                        failing: 'Срывается',
                        inTransit: 'Машина в пути',
                        headingToLoading: 'Еду на погрузку',
                        loading: 'На погрузке',
                        unloading: 'На выгрузке',
                        delivered: 'Груз сдан',
                        completed: 'Выполнен'
                    }

                    const status = row.original.status

                    return status ? (
                        <span>{statusMap[status] || status}</span>
                    ) : (
                        <div className='flex items-center justify-center'>
                            <Loader2 className='animate-spin mr-2 h-5 w-5' />
                        </div>
                    )
                },
                searchable: true,
                filterType: 'select',
                isMobile: true,
                isShortVersion: true,
                filterOptions: [
                    {
                        value: [
                            'new',
                            'inTransit',
                            'completed',
                            'failing',
                            'failed',
                            'canceledByCustomer',
                            'canceledByCarrier',
                            'canceledByCustomerWithPenalty',
                            'canceledByCarrierWithPenalty',
                            'headingToLoading',
                            'loading',
                            'unloading',
                            'delivered'
                        ],
                        label: 'Все (кроме отм.)'
                    },
                    {
                        value: [
                            'new',
                            'inTransit',
                            'completed',
                            'failing',
                            'failed',
                            'canceledByCustomer',
                            'canceledByCarrier',
                            'canceledByCustomerWithPenalty',
                            'canceledByCarrierWithPenalty',
                            'headingToLoading',
                            'loading',
                            'unloading',
                            'delivered',
                            'canceled'
                        ],
                        label: 'Все'
                    },

                    { value: 'new', label: 'Новый' },
                    { value: 'canceledByCarrierWithPenalty', label: 'Отменяется перевозчиком (половина ГО)' },
                    { value: 'canceledByCustomerWithPenalty', label: 'Отменяется заказчиком (половина ГО)' },
                    { value: 'canceledByCarrier', label: 'Отменяется перевозчиком' },
                    { value: 'canceledByCustomer', label: 'Отменяется заказчиком' },
                    { value: 'failed', label: 'Сорван' },
                    { value: 'failing', label: 'Срывается' },
                    { value: 'completed', label: 'Выполнен' },
                    { value: 'inTransit', label: 'Машина в пути' },
                    { value: 'canceled', label: 'Отменен' },
                    { value: 'headingToLoading', label: 'Еду на погрузку' },
                    { value: 'loading', label: 'На погрузке' },
                    { value: 'unloading', label: 'На выгрузке' },
                    { value: 'delivered', label: 'Груз сдан' }
                ]
            },
            {
                accessorKey: 'docSubmissionDate',
                header: 'Док сданы',
                size: 100,
                accessorFn: (row: Bid) =>
                    row.docSubmissionDate
                        ? format(new Date(row.docSubmissionDate), 'dd.MM.yyyy HH:mm', { locale: ru })
                        : '—',
                isShortVersion: false,
                searchable: true,
                filterType: 'exact',
                isMobile: false
            },
            {
                accessorKey: 'price',
                header: 'Моя цена',
                size: 150,
                cell: ({ getValue }) => {
                    const value = getValue()
                    return formatNumber(String(value))
                },
                searchable: true,
                filterType: 'fuzzy'
            },
            {
                accessorKey: 'extraServicesPrice',
                header: 'Доп услуги',
                size: 150,
                cell: ({ getValue }) => {
                    const value = getValue()
                    return formatNumber(String(value))
                },
                searchable: true,
                filterType: 'range',
                sortingFn: (rowA, rowB, columnId) => {
                    const valueA = rowA.getValue(columnId)
                    const valueB = rowB.getValue(columnId)

                    const numA = typeof valueA === 'string' ? Number(valueA.replace(/\D/g, '')) : Number(valueA ?? 0)
                    const numB = typeof valueB === 'string' ? Number(valueB.replace(/\D/g, '')) : Number(valueB ?? 0)

                    return numA - numB
                }
            },
            {
                accessorKey: 'fullPrice',
                header: 'Цена + доп',
                size: 150,
                isShortVersion: true,
                cell: ({ getValue }) => {
                    const value = getValue()
                    return formatNumber(String(value))
                },
                searchable: true,
                filterType: 'range',
                sortingFn: (rowA, rowB, columnId) => {
                    const valueA = rowA.getValue(columnId)
                    const valueB = rowB.getValue(columnId)

                    const numA = typeof valueA === 'string' ? Number(valueA.replace(/\D/g, '')) : Number(valueA ?? 0)
                    const numB = typeof valueB === 'string' ? Number(valueB.replace(/\D/g, '')) : Number(valueB ?? 0)

                    return numA - numB
                }
            },
            {
                accessorKey: 'commission',
                header: 'Комиссия',
                size: 100,
                cell: ({ getValue }) => {
                    const value = getValue()
                    return formatNumber(String(value))
                },
                searchable: true,
                filterType: 'range',
                sortingFn: (rowA, rowB, columnId) => {
                    const valueA = rowA.getValue(columnId)
                    const valueB = rowB.getValue(columnId)

                    const numA = typeof valueA === 'string' ? Number(valueA.replace(/\D/g, '')) : Number(valueA ?? 0)
                    const numB = typeof valueB === 'string' ? Number(valueB.replace(/\D/g, '')) : Number(valueB ?? 0)

                    return numA - numB
                }
            },
            {
                accessorKey: 'fullPriceNds',
                header: 'К оплате',
                size: 150,
                cell: ({ getValue }) => {
                    const value = getValue()
                    return formatNumber(String(value))
                },
                searchable: true,
                filterType: 'range',
                sortingFn: (rowA, rowB, columnId) => {
                    const valueA = rowA.getValue(columnId)
                    const valueB = rowB.getValue(columnId)

                    const numA = typeof valueA === 'string' ? Number(valueA.replace(/\D/g, '')) : Number(valueA ?? 0)
                    const numB = typeof valueB === 'string' ? Number(valueB.replace(/\D/g, '')) : Number(valueB ?? 0)

                    return numA - numB
                }
            },
            {
                accessorKey: 'createdAt',
                header: 'Создано',
                size: 120,
                searchable: true,
                filterType: 'dateRange',
                accessorFn: (row: Bid) =>
                    row.createdAt ? format(new Date(row.createdAt), 'dd.MM.yyyy HH:mm', { locale: ru }) : '—'
            },

            {
                accessorKey: 'clientName',
                header: 'Клиент',
                accessorFn: (row: Bid) => row.buyBid?.client?.organizationName ?? '—',
                size: 120,
                searchable: true,
                isShortVersion: true,
                filterType: 'fuzzy'
            },
            {
                accessorKey: 'customerName',
                header: 'Заказчик',
                size: 150,
                searchable: true,
                accessorFn: (row: Bid) => row.buyBid?.customer?.organizationName ?? '—',
                filterType: 'fuzzy'
            },
            {
                accessorKey: 'carrierName',
                header: 'Перевозчик',
                size: 150,
                searchable: true,
                accessorFn: (row: Bid) => row.carrier?.organizationName ?? '—',
                filterType: 'fuzzy'
            },
            {
                accessorKey: 'driver',
                header: 'Водитель',
                size: 150,
                searchable: true,
                accessorFn: (row: Bid) => row.driverUser?.fio ?? '—',
                filterType: 'fuzzy'
            },
            {
                accessorKey: 'vehiclePlateNumberAndModel',
                header: 'Машина',
                size: 150,
                searchable: true,
                accessorFn: (row: Bid) =>
                    row.assignedVehicle
                        ? `${row.assignedVehicle.docModel ?? '—'} | ${row.assignedVehicle.plateNum ?? '—'}`
                        : '—',
                filterType: 'fuzzy'
            },
            {
                accessorKey: 'trailerPlateNumberAndModel',
                header: 'Прицеп',
                size: 150,
                searchable: true,
                accessorFn: (row: Bid) => row.assignedTrailer?.plateNum ?? '—',
                filterType: 'fuzzy'
            },
            {
                accessorKey: 'statusUpdatedUser',
                header: 'Автор статуса',
                size: 150,
                searchable: true,
                accessorFn: (row: Bid) => row.statusUpdatedUser?.fio ?? '—',
                filterType: 'fuzzy'
            },
            {
                accessorKey: 'docSubmissionUser',
                header: 'Бухгалтер',
                size: 150,
                searchable: true,
                accessorFn: (row: Bid) => row.docSubmissionUser?.fio ?? '—',
                filterType: 'fuzzy'
            },

            {
                accessorKey: 'buyBidAuthor',
                header: 'Автор заявки',
                size: 150,
                searchable: true,
                accessorFn: (row: Bid) => row.buyBid?.author?.fio ?? '—',
                filterType: 'fuzzy'
            },
            {
                accessorKey: 'saleBidAuthor',
                header: 'Автор предложения',
                size: 150,
                searchable: true,
                accessorFn: (row: Bid) => row.saleBid?.author?.fio ?? '—',

                filterType: 'fuzzy'
            }
        ]

        return allColumns.filter(col => (isShortTable ? col.isShortVersion : true))
    }, [isShortTable, onApprove, onDelete, onOpenModal])
}
