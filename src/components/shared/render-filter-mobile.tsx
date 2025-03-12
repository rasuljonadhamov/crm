import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'

import { useBidsTableColumns } from '@/pages/bids/components/bids-table/bids-table-columns'
import { useOrdersTableColumns } from '@/pages/orders/components/use-orders-table-columns'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'

import { useFilter } from '@/context/filter-context'
import { useGetBids } from '@/api/use-get-bids'
import { useGetOrders } from '@/api/use-get-orders'

import { FilterInput } from './render-filter-input'
import { ListFilter } from 'lucide-react'

export function RenderFilterMobile() {
    const location = useLocation()
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [searchParams] = useSearchParams()
    const size = useMemo(() => Number(searchParams.get('size')) || 200, [searchParams])
    const { filters, handleFilterChange } = useFilter()
    const [localFilters, setLocalFilters] = useState(filters)

    const isMounted = useRef(false)
    const prevFiltersRef = useRef(filters)

    const isMobile = useMemo(() => window.innerWidth <= 768, [])

    const pageType = useMemo(() => {
        if (location.pathname.includes('/orders')) return 'orders'
        if (location.pathname.includes('/bids')) return 'bids'
        return null
    }, [location.pathname])

    const { loading: loadingBids, refreshBids } = useGetBids(size)
    const { loading: loadingOrders, refreshOrders } = useGetOrders(size)

    const loading = pageType === 'orders' ? loadingOrders : loadingBids
    const refreshData = pageType === 'orders' ? refreshOrders : refreshBids

    useEffect(() => {
        if (isMounted.current) {
            if (JSON.stringify(filters) !== JSON.stringify(prevFiltersRef.current)) {
                setLocalFilters(filters)
                prevFiltersRef.current = filters
            }
        } else {
            isMounted.current = true
        }
    }, [filters])

    const applyFilters = useCallback(() => {
        Object.entries(localFilters).forEach(([key, value]) => {
            if (handleFilterChange) {
                handleFilterChange(key, value)
            }
        })
        refreshData()
        setIsOpen(false)
    }, [localFilters, refreshData, handleFilterChange])

    const resetFilters = useCallback(() => {
        const emptyFilters = {};
        setLocalFilters(emptyFilters);
    
        Object.keys(filters).forEach((key) => {
            handleFilterChange(key, undefined);
        });
    
        refreshData();
        setIsOpen(false);
    }, [filters, refreshData, handleFilterChange]);
    

    const ordersColumns = useOrdersTableColumns({
        onApprove: applyFilters,
        isMobile: true,
        isShortTable: false,
        onDelete: () => {},
        onOpenModal: () => {}
    })

    const bidsColumns = useBidsTableColumns({
        onApprove: applyFilters,
        isMobile: true
    })

    const originalColumns = pageType === 'orders' ? ordersColumns : bidsColumns

    const memoizedColumns = useMemo(() => {
        return (
            originalColumns
                // @ts-expect-error надо что то сделать
                .filter(column => column.isMobile === true)
                .map(column => ({
                    // @ts-expect-error надо что то сделать
                    id: column.accessorKey,
                    columnDef: {
                        // @ts-expect-error надо что то сделать
                        filterType: column.filterType,
                        // @ts-expect-error надо что то сделать
                        filterOptions: column.filterOptions,
                        header: column.header
                    },
                    // @ts-expect-error надо что то сделать
                    getFilterValue: () => localFilters[column.accessorKey] || null,
                    setFilterValue: (value: any) => {
                        setLocalFilters(prev => ({
                            ...prev,
                            // @ts-expect-error надо что то сделать
                            [column.accessorKey]: value
                        }))
                    }
                }))
        )
    }, [originalColumns, localFilters])

    if (!isMobile) return null

    return (
        <div className='ml-2'>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button variant='outline' size='icon' className='relative'>
                        <ListFilter className='h-[1.2rem] w-[1.2rem]' />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className='p-4 w-72'>
                    <div className='space-y-4'>
                        {memoizedColumns.map(column => (
                            <div key={column.id} className='space-y-2'>
                                {/* @ts-expect-error надо что то сделать */}
                                <label className='text-xs font-medium'>{column.columnDef.header}</label>
                                <div>
                                    <FilterInput column={column} handleFilterChange={handleFilterChange} />
                                </div>
                            </div>
                        ))}

                        <div className='flex justify-end pt-2'>
                            <Button variant='outline' size='sm' onClick={resetFilters} className='mr-2'>
                                Сбросить
                            </Button>
                            <Button size='sm' onClick={applyFilters} disabled={loading}>
                                {loading ? 'Загрузка...' : 'Применить'}
                            </Button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}
