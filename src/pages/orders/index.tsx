import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { FilterProvider, useFilter } from '@/context/filter-context'
import { TotalsProvider } from '@/context/totals-context'

import { useWebSocket } from '@/api/use-websocket'
import { useGetOrders } from '@/api/use-get-orders'

import { lazy } from 'react'

const BgruzHeader = lazy(() => import('@/components/shared/bgruz-header'))
const PageHead = lazy(() => import('@/components/shared/page-head'))
const OrdersTable = lazy(() => import('./components/orders-table'))
const OrderTableMobile = lazy(() => import('./components/orders-table-mobile'))

export default function OrderPage() {
    const [searchParams] = useSearchParams()
    const [size, setSize] = useState(Number(searchParams.get('size')) || 500)
    const { orders, hasMore, loading, refreshOrders } = useGetOrders(size)
    const { setFilters } = useFilter()

    const loadMore = () => {
        if (hasMore) {
            setSize(prev => prev + 50)
        }
    }

    useWebSocket(() => {}, refreshOrders)

    return (
        <div className='p-4'>
            <PageHead title='Заказы' />
            <TotalsProvider data={orders}>
                <BgruzHeader />
                <FilterProvider onFiltersChange={setFilters}>
                    <div className='hidden md:block'>
                        {/* @ts-expect-error надо что то сделать */}
                        <OrdersTable
                            orders={orders || []}
                            setFilters={setFilters}
                            loadMore={loadMore}
                            hasMore={hasMore}
                            loading={loading}
                        />
                    </div>
                    <div className='md:hidden'>
                        <OrderTableMobile orders={orders || []} />
                    </div>
                </FilterProvider>
            </TotalsProvider>
        </div>
    )
}
