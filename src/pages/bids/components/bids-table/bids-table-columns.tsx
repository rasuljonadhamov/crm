import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Eye, Loader2, Trash } from 'lucide-react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import AuctionTimer from '@/hooks/use-action-timer'

interface Bid {
    id: string
    persistentId: string
    cargoTitle: string
    client: { organizationName: string }
    price: number | null
    status: string | null
    filingTime: string
    createdBy: string
    createdAt: string
    isPriceRequest?: boolean
    customer?: { organizationName: string }
    terminal1?: { cityName: string }
    terminal2?: { cityName: string }
    warehouses?: { cityName: string }[]
    vehicleProfile?: { name: string }
    loadingDate: number
    activationTime: string
    cargoType?: 'wagon' | 'container'
    loadingMode?: 'loading' | 'unloading' | 'moving'
    auction?: number
    bestSalePrice?: number
    extraServicesPrice?: number
    fullPrice?: number
    commission?: number
    fullPriceNDS?: number
    [key: string]: unknown
}

interface ColumnsProps {
    isMobile?: boolean
    isShortTable?: boolean
    onApprove?: (bidId: string) => void
    onDelete?: (bidId: string) => void
    onOpenModal?: (bidId: string) => void
}

export const useBidsTableColumns = ({ isShortTable, onApprove, onDelete, onOpenModal, isMobile }: ColumnsProps) => {
    const formatNumber = (value: string) => {
        const num = value.replace(/\D/g, '')
        return num ? new Intl.NumberFormat('ru-RU').format(Number(num)) : ''
    }

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
                accessorKey: 'number',
                header: 'ID',
                size: 100,
                isShortVersion: false,
                searchable: true,
                filterType: 'exact',
                isMobile: false
            },
            {
                accessorKey: 'persistentId',
                header: 'ЦМ ID',
                size: 100,
                isShortVersion: false,
                searchable: true,
                filterType: 'exact',
                isMobile: false
            },
            {
                header: 'Вагон/Конт',
                accessorKey: 'cargoType',
                size: 200,
                accessorFn: row => {
                    let cargoTypeLabel = ''
                    if (row.cargoType === 'wagon') {
                        cargoTypeLabel = 'Вагон'
                    } else if (row.cargoType === 'container') {
                        cargoTypeLabel = 'Контейнер'
                    }
                    return ` ${cargoTypeLabel}`
                },

                searchable: true,
                filterType: 'select',
                filterOptions: [
                    { value: ['wagon', 'container'], label: 'Все' },
                    { value: 'wagon', label: 'Вагон' },
                    { value: 'container', label: 'Контейнер' }
                ]
            },
            {
                header: 'Операция',
                accessorKey: 'loadingMode',
                size: 200,
                accessorFn: row => {
                    let loadingModeLabel = ''

                    if (row.loadingMode === 'loading') {
                        loadingModeLabel = 'Погрузка'
                    } else if (row.loadingMode === 'moving') {
                        loadingModeLabel = 'Перемещение'
                    } else {
                        loadingModeLabel = 'Выгрузка'
                    }

                    return loadingModeLabel
                },
                searchable: true,
                filterType: 'select',
                filterOptions: [
                    { value: ['loading', 'unloading', 'moving'], label: 'Все' },
                    { value: 'loading', label: 'Погрузка' },
                    { value: 'unloading', label: 'Выгрузка' },
                    { value: 'moving', label: 'Перемещение' }
                ]
            },
            {
                accessorKey: 'loadingDate',
                header: 'Дата подачи',
                size: 120,
                isShortVersion: true,
                searchable: true,
                accessorFn: row =>
                    row.loadingDate ? format(new Date(row.loadingDate), 'dd.MM.yyyy', { locale: ru }) : '',
                filterType: 'dateRange',
                isMobile: true
            },
            {
                accessorKey: 'terminal1',
                header: 'Терминал 1',
                size: 120,
                accessorFn: row => row.terminal1?.cityName ?? '—',
                isShortVersion: true,
                searchable: true,
                filterType: 'fuzzy',
                isMobile: true
            },
            {
                accessorKey: 'warehouses',
                header: 'Склад',
                size: 120,
                accessorFn: row => row.warehouses?.[0]?.cityName ?? '—',
                isShortVersion: true,
                searchable: true,
                filterType: 'fuzzy',
                isMobile: true
            },
            {
                accessorKey: 'terminal2',
                header: 'Терминал 2',
                size: 120,
                accessorFn: row => row.terminal2?.cityName ?? '—',
                isShortVersion: true,
                searchable: true,
                filterType: 'fuzzy',
                isMobile: true
            },
            {
                accessorKey: 'vehicleProfile',
                header: 'Профиль ТС',
                size: 150,
                accessorFn: row => row.vehicleProfile?.name ?? '—',
                isShortVersion: true,
                searchable: true,
                filterType: 'fuzzy'
            },
            {
                header: 'Аукцион',
                size: 140,
                accessorKey: 'activationTime',
                cell: ({ row }) => {
                    return <AuctionTimer activationTime={row.original.activationTime} />
                },
                isShortVersion: true,
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
                accessorKey: 'status',
                header: 'Статус',
                size: 100,
                accessorFn: row => row.status ?? null,
                cell: ({ row }) => {
                    const statusMap = {
                        active: 'Активна',
                        waiting: 'На ожидании',
                        executed: 'Выполнена',
                        canceled: 'Отменена'
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
                isShortVersion: true,
                filterType: 'select',
                isMobile: true,
                filterOptions: [
                    { value: ['active', 'waiting', 'executed', 'canceled'], label: 'Все' },
                    { value: ['active', 'waiting'], label: 'Акт.+ожид.' },
                    { value: 'active', label: 'Активна' },
                    { value: 'waiting', label: 'На ожидании' },
                    { value: 'executed', label: 'Выполнена' },
                    { value: 'canceled', label: 'Отменены' }
                ]
            },
            {
                accessorKey: 'price',
                header: 'Моя цена',
                size: 100,
                searchable: true,
                isShortVersion: true,
                cell: ({ getValue }) => {
                    const value = getValue()
                    return value ? formatNumber(String(value)) : 'Запрос'
                },
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
                accessorKey: 'bestSalePrice',
                header: 'Предложение',
                size: 120,
                searchable: true,
                isShortVersion: true,
                cell: ({ getValue }) => {
                    const value = getValue()
                    return formatNumber(String(value))
                },
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
                accessorKey: 'extraServicesPrice',
                header: 'Доп услуги',
                size: 170,
                searchable: true,
                cell: ({ getValue }) => {
                    const value = getValue()
                    return formatNumber(String(value))
                },
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
                searchable: true,
                cell: ({ getValue }) => {
                    const value = getValue()
                    return formatNumber(String(value))
                },
                filterType: 'range',
                sortingFn: (rowA, rowB, columnId) => {
                    const valueA = rowA.getValue(columnId)
                    const valueB = rowB.getValue(columnId)

                    const numA = typeof valueA === 'string' ? Number(valueA.replace(/\D/g, '')) : Number(valueA ?? 0)
                    const numB = typeof valueB === 'string' ? Number(valueB.replace(/\D/g, '')) : Number(valueB ?? 0)

                    return numA - numB
                }
            },
            { accessorKey: 'comission', header: 'Комиссия', size: 100, searchable: true, filterType: 'range' },
            {
                accessorKey: 'fullPriceNds',
                header: 'К оплате',
                size: 150,
                searchable: true,
                cell: ({ getValue }) => {
                    const value = getValue()
                    return formatNumber(String(value))
                },
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
                size: 150,
                accessorFn: row => format(new Date(row.createdAt), 'dd.MM.yyyy HH:mm:ss', { locale: ru }),
                searchable: true,
                filterType: 'dateRange'
            },
            { accessorKey: 'createdBy', header: 'Создал', size: 150, searchable: true, filterType: 'fuzzy' },
            {
                accessorKey: 'clientName',
                header: 'Клиент',
                size: 150,
                accessorFn: (row: Bid) => row.client?.organizationName ?? '—',
                searchable: true,
                filterType: 'fuzzy'
            },
            {
                accessorKey: 'customerName',
                header: 'Заказчик',
                size: 150,
                accessorFn: (row: Bid) => row.customer?.organizationName ?? '—',
                searchable: true,
                filterType: 'fuzzy'
            },
            {
                accessorKey: 'isPriceRequest',
                header: 'Согласовано',
                size: 150,
                cell: ({ row }) => {
                    const { bestSalePrice, status, ownState } = row.original
                    const isDisabled = !bestSalePrice || status === 'canceled' || ownState === 'approved'

                    return (
                        <Button
                            onClick={() => onApprove?.(row.original.id)}
                            disabled={isDisabled}
                            className={isDisabled ? 'bg-gray-400 text-white' : ''}
                        >
                            Согласовать
                        </Button>
                    )
                },
                isShortVersion: true
            },

            {
                header: 'Действия',
                size: 80,
                cell: ({ row }) => (
                    <div className='flex justify-center'>
                        <Eye className='mr-2 h-5 w-5 cursor-pointer' onClick={() => onOpenModal?.(row.original.id)} />
                        <Trash
                            className='mr-2 h-5 w-5 cursor-pointer text-red-500'
                            onClick={() => onDelete?.(row.original.id)}
                        />
                    </div>
                )
            }
        ]

        return allColumns.filter(col => (isShortTable ? col.isShortVersion : true))
    }, [isShortTable, onApprove, onDelete, onOpenModal])
}
