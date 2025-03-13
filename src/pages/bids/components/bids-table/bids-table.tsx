import { useState, useCallback, useEffect } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    type ColumnFiltersState,
    type SortingState,
    getSortedRowModel,
} from '@tanstack/react-table';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useBidsTableColumns } from './bids-table-columns';
import BidsInfoModal from '../bids-info-modal';
import BidHeader from '../bids-header';
import { deleteData, postData2 } from '@/api/api';
import { Loader2 } from 'lucide-react';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { useFilter } from '@/context/filter-context';
import { FilterInput } from '@/components/shared/render-filter-input';

interface Bid {
    id?: string;
    client: { organizationName: string };
    cargoTitle: string;
    price: number | null;
    status: string | null;
    columns: string;
}

interface BidsTableProps {
    bids: Bid[] | any[];
    hasMore: boolean;
    loading: boolean;
    lastBidRef: (node: HTMLTableRowElement) => void; // Adjusted to match HTMLTableRowElement
}

function BidsTable({ bids, hasMore, loading, lastBidRef }: BidsTableProps) {
    const { filters, handleFilterChange } = useFilter();

    const [selectedBid, setSelectedBid] = useState<Partial<Bid> | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isShortTable, setIsShortTable] = useState(() => {
        return localStorage.getItem('isShortTable') === 'true';
    });
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        Object.entries(filters).map(([id, value]) => ({ id, value }))
    );
    const [sorting, setSorting] = useState<SortingState>([]);

    useEffect(() => {
        localStorage.setItem('isShortTable', String(isShortTable));
    }, [isShortTable]);

    const handleOpenModal = useCallback((bid: Bid) => {
        setSelectedBid(bid);
        setIsModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedBid(null);
    }, []);

    const handleApprove = useCallback(async (bidId: string) => {
        const token = localStorage.getItem('authToken');
        await postData2(`api/v1/bids/${bidId}/approve`, {}, token);
    }, []);

    const handleDelete = useCallback(async (bidId: string) => {
        if (window.confirm(`Удалить заявку ${bidId}?`)) {
            const token = localStorage.getItem('authToken');
            await deleteData(`api/v1/bids/${bidId}`, token);
        }
    }, []);

    const columns = useBidsTableColumns({
        isShortTable,
        onApprove: handleApprove,
        onDelete: handleDelete,
    });

    const table = useReactTable({
        data: bids || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            columnFilters,
            sorting,
        },
        onColumnFiltersChange: setColumnFilters,
        onSortingChange: setSorting,
        enableSorting: true,
    });

    useEffect(() => {
        const newColumnFilters = Object.entries(filters).map(([id, value]) => ({ id, value }));
        setColumnFilters(newColumnFilters);
    }, [filters]);

    return (
        <div>
            <BidHeader setIsShortTable={setIsShortTable} isShortTable={isShortTable} />

            <ScrollArea className="h-[calc(98vh-200px)]">
                <Table style={{ overflow: 'visible' }} className="min-w-[1000px] border border-gray-300 relative">
                    <TableHeader className="!sticky !top-0 z-50">
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <TableHead
                                        key={header.id}
                                        className="bg-[#EDEDED] font-bold text-[20px] border border-gray-300 whitespace-nowrap"
                                    >
                                        <div className="text-center">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </div>
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <TableHead
                                        key={header.id}
                                        className="bg-[#EDEDED] border border-gray-300 whitespace-nowrap"
                                    >
                                        <div>
                                            {header.column.columnDef.filterType !== 'range' ? (
                                                <div className="text-center">
                                                    <FilterInput
                                                        column={header.column}
                                                        handleFilterChange={handleFilterChange}
                                                    />
                                                </div>
                                            ) : (
                                                <div
                                                    className="flex items-center gap-1 cursor-pointer px-3 py-5 md:px-3 md:py-2 text-base md:text-xl rounded-md bg-white"
                                                    onClick={header.column.getToggleSortingHandler()}
                                                >
                                                    <div className="text-center">
                                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                                    </div>
                                                    {header.column.getIsSorted() ? (
                                                        header.column.getIsSorted() === 'asc' ? (
                                                            <ArrowUp className="h-4 w-4" />
                                                        ) : (
                                                            <ArrowDown className="h-4 w-4" />
                                                        )
                                                    ) : (
                                                        <ArrowUpDown className="h-4 w-4 opacity-50" />
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.map((row, index) => {
                            const isLastRow = index === table.getRowModel().rows.length - 1;
                            return (
                                <TableRow
                                    ref={isLastRow && hasMore ? lastBidRef : null}
                                    onDoubleClick={() => handleOpenModal(row.original)}
                                    key={row.id}
                                    className={`cursor-pointer text-[16px] hover:bg-gray-100 ${
                                        row.original.status === 'canceled'
                                            ? 'bg-gray-50 opacity-50 line-through'
                                            : index % 2 === 0
                                            ? 'bg-gray-100'
                                            : ''
                                    }`}
                                >
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell
                                            key={cell.id}
                                            className="border border-gray-300 text-center whitespace-nowrap !p-0 !px-1"
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            );
                        })}
                        {loading && (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center p-4">
                                    <div className="flex items-center justify-center">
                                        <Loader2 className="animate-spin mr-2 h-8 w-8" />
                                        <span className="ml-2 text-gray-500">Загрузка данных...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                        {!loading && !bids.length && (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center p-4">
                                    <span className="text-gray-500">Нет данных для отображения</span>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>

            {selectedBid && (
                <BidsInfoModal
                    selectedBid={selectedBid}
                    handleCloseModal={handleCloseModal}
                    open={isModalOpen}
                />
            )}
        </div>
    );
}

export default BidsTable;