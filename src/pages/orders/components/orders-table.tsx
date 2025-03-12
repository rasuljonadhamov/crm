import { useState, useCallback, useRef, useEffect } from 'react'

import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    getSortedRowModel,
    type ColumnFiltersState,
    type SortingState
} from '@tanstack/react-table'

import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

import { deleteData, postData2 } from '@/api/api'

import { useOrdersTableColumns } from './use-orders-table-columns'
import OrderInfoModal from './orders-info-modal'
import OrdersHeader from './orders-header'
import { FilterInput } from '@/components/shared/render-filter-input'
import { ArrowDown, ArrowUp, ArrowUpDown, Loader2 } from 'lucide-react'
import { useFilter } from '@/context/filter-context'

interface Bid {
    _id?: string
    client: { organizationName: string }
    cargoTitle: string
    price: number | null
    status: string | null
}

interface BidsTableProps {
    orders: Bid[] | any[]
    setFilters: (filters: Record<string, unknown>) => void
    handleFilterChange: (columnId: string, value: any) => void
    loadMore: () => void
    hasMore: boolean
    loading: boolean
    localFilters: Record<string, string | any[]>
}

function OrdersTable({ orders, loadMore, hasMore, loading }: BidsTableProps) {
    const [selectedBid, setSelectedBid] = useState<Partial<Bid> | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isShortTable, setIsShortTable] = useState(() => {
        return localStorage.getItem('isShortTable') === 'true'
    })

    const { filters, handleFilterChange } = useFilter()

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        Object.entries(filters || {}).map(([id, value]) => ({ id, value }))
    )

    const [sorting, setSorting] = useState<SortingState>([])

    const scrollRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        localStorage.setItem('isShortTable', String(isShortTable))
    }, [isShortTable])

    useEffect(() => {
        let isFetching = false

        const handleScroll = () => {
            if (!scrollRef.current || isFetching) return

            const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
            const isBottom = scrollTop + clientHeight >= scrollHeight - 50

            if (isBottom && hasMore && !loading) {
                isFetching = true
                loadMore()
                setTimeout(() => {
                    isFetching = false
                }, 500)
            }
        }

        const currentScroll = scrollRef.current
        if (currentScroll) {
            currentScroll.addEventListener('scroll', handleScroll)
        }

        return () => {
            if (currentScroll) {
                currentScroll.removeEventListener('scroll', handleScroll)
            }
        }
    }, [hasMore, loading, loadMore])

    const handleOpenModal = useCallback((bid: Bid) => {
        setSelectedBid(bid)
        setIsModalOpen(true)
    }, [])

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false)
        setSelectedBid(null)
    }, [])

    const handleApprove = useCallback(async (bidId: string) => {
        const token = localStorage.getItem('authToken')
        await postData2(`api/v1/orders/${bidId}/approve`, {}, token)
    }, [])

    const handleDelete = useCallback(async (bidId: string) => {
        if (window.confirm(`Удалить заявку ${bidId}?`)) {
            const token = localStorage.getItem('authToken')
            await deleteData(`api/v1/orders/${bidId}`, token)
        }
    }, [])

    const columns = useOrdersTableColumns({
        isShortTable,
        onApprove: handleApprove,
        onDelete: handleDelete,
        onOpenModal: handleOpenModal
    })

    const table = useReactTable({
        data: orders || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        columnResizeMode: 'onChange',
        state: {
            columnFilters,
            sorting
        },
        onColumnFiltersChange: setColumnFilters,
        onSortingChange: setSorting,
        enableColumnResizing: true,
        enableSorting: true
    })
    return (
        <div>
            <OrdersHeader setIsShortTable={setIsShortTable} isShortTable={isShortTable} />
            <ScrollArea>
                <div className='h-[calc(98vh-200px)] relative !scrollbar-thin !scrollbar-thumb-gray-400 !scrollbar-track-gray-100'>
                    <Table
                        style={{ overflow: 'visible', minWidth: '100%' }}
                        className='min-w-[1000px] border  border-gray-300 relative'
                    >
                        <TableHeader className='!sticky !top-0 z-50 w-auto'>
                            {table.getHeaderGroups().map(headerGroup => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <TableHead
                                            key={header.id}
                                            className='relative bg-[#EDEDED] font-bold text-[20px] border border-gray-300 whitespace-nowrap'
                                            style={{ width: header.getSize() }}
                                        >
                                            <div className='text-center'>
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                            </div>
                                            {header.column.getCanResize() && (
                                                <div
                                                    {...{
                                                        onMouseDown: header.getResizeHandler(),
                                                        onTouchStart: header.getResizeHandler(),
                                                        className: `absolute right-0 top-0 h-full w-1  cursor-col-resize`
                                                    }}
                                                />
                                            )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                            {table.getHeaderGroups().map(headerGroup => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <TableHead
                                            key={header.id}
                                            className='bg-[#EDEDED] border border-gray-300 whitespace-nowrap'
                                        >
                                            <div>
                                                {
                                                    // @ts-expect-error надо что то сделать
                                                    header.column.columnDef.filterType !== 'range' ? (
                                                        <div className='text-center'>
                                                            <FilterInput
                                                                column={header.column}
                                                                handleFilterChange={handleFilterChange}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div
                                                            className='flex  items-center gap-1 cursor-pointer px-3 py-5 md:px-3 md:py-2 text-base md:text-xl rounded-md bg-white'
                                                            onClick={header.column.getToggleSortingHandler()}
                                                        >
                                                            <div className='text-center'>
                                                                {flexRender(
                                                                    header.column.columnDef.header,
                                                                    header.getContext()
                                                                )}
                                                            </div>
                                                            {header.column.getIsSorted() ? (
                                                                header.column.getIsSorted() === 'asc' ? (
                                                                    <ArrowUp className='h-4 w-4' />
                                                                ) : (
                                                                    <ArrowDown className='h-4 w-4' />
                                                                )
                                                            ) : (
                                                                <ArrowUpDown className='h-4 w-4 opacity-50' />
                                                            )}
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows.map((row, index) => (
                                <TableRow
                                    onDoubleClick={() => handleOpenModal(row.original)}
                                    key={row.id}
                                    className={`cursor-pointer text-[16px] hover:bg-gray-100 !py-2 ${
                                        row.original.ownState === 'canceled'
                                            ? 'bg-gray-50 opacity-50 line-through'
                                            : index % 2 === 0
                                              ? 'bg-gray-100'
                                              : ''
                                    }`}
                                >
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell
                                            key={cell.id}
                                            className='border border-gray-300 text-center whitespace-nowrap  !px-1 '
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                            {loading && (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className='text-center p-4'>
                                        <div className='flex items-center justify-center'>
                                            <Loader2 className='animate-spin mr-2 h-8 w-8' />
                                            <span className='ml-2 text-gray-500'>Загрузка данных...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                            {!loading && !orders.length && (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className='text-center p-4'>
                                        <span className='text-gray-500'>Нет данных для отображения</span>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <ScrollBar orientation='horizontal' />
            </ScrollArea>

            {selectedBid && (
                <OrderInfoModal
                    handleCloseModal={handleCloseModal}
                    selectedBid={selectedBid}
                    isModalOpen={isModalOpen}
                />
            )}
        </div>
    )
}

export default OrdersTable
