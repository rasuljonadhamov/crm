// import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

// interface FilterProviderProps {
//     children: React.ReactNode
//     onFiltersChange?: (filters: { [key: string]: any }) => void
//     initialFilters?: { [key: string]: any }
//     pageType: 'orders' | 'bids'
// }

// interface FilterContextProps {
//     filters: { [key: string]: any }
//     handleFilterChange: (columnId: string, value: any) => void
//     setFilters: (filters: { [key: string]: any }) => void
//     clearFilters: () => void
//     pageType: 'orders' | 'bids'
// }

// const FilterContext = createContext<FilterContextProps | undefined>(undefined)

// export function FilterProvider({ children, onFiltersChange, initialFilters = {}, pageType }: FilterProviderProps) {
//     const [filters, setLocalFilters] = useState<{ [key: string]: any }>(initialFilters)
//     const debounceRef = useRef<NodeJS.Timeout | null>(null)

//     useEffect(() => {
//         setLocalFilters(initialFilters)
//         if (onFiltersChange) {
//             onFiltersChange(initialFilters)
//         }
//     }, [pageType])

//     const handleFilterChange = useCallback(
//         (columnId: string, value: any) => {
//             let formattedValue = value

//             if (columnId === 'loadingMode' || columnId === 'cargoType' || columnId === 'status') {
//                 formattedValue = Array.isArray(value) ? value : [value]
//             } else if ((columnId === 'loadingDate' || columnId === 'createdAt') && value) {
//                 formattedValue = {
//                     start: new Date(value.from.setHours(23, 59, 59, 999)).toISOString(),
//                     end: new Date(value.to.setHours(23, 59, 59, 999)).toISOString()
//                 }
//             } else if (['number', 'fullPrice', 'comission', 'extraServicesPrice'].includes(columnId)) {
//                 formattedValue = Number(value)
//             }

//             const newFilters = {
//                 ...filters,
//                 [columnId]: formattedValue
//             }

//             if (debounceRef.current) clearTimeout(debounceRef.current)
//             debounceRef.current = setTimeout(() => {
//                 setLocalFilters(newFilters)
//                 if (onFiltersChange) {
//                     onFiltersChange(newFilters)
//                 }
//             }, 500)
//         },
//         [filters, onFiltersChange]
//     )

//     return (
//         <FilterContext.Provider
//             value={{
//                 filters,
//                 handleFilterChange,
//                 setFilters: setLocalFilters,
//                 clearFilters: () => setLocalFilters({}),
//                 pageType
//             }}
//         >
//             {children}
//         </FilterContext.Provider>
//     )
// }

// export function useFilter() {
//     const context = useContext(FilterContext)
//     if (context === undefined) {
//         throw new Error('useFilter must be used within a FilterProvider')
//     }
//     return context
// }

import type React from 'react'
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

interface FilterProviderProps {
    children: React.ReactNode
    onFiltersChange?: (filters: { [key: string]: any }, pageType: 'orders' | 'bids') => void
}

interface FilterContextProps {
    filters: { [key: string]: any }
    handleFilterChange: (columnId: string, value: any) => void
    setFilters: (filters: { [key: string]: any }) => void
    clearFilters: () => void
    pageType: 'orders' | 'bids'
}

const FilterContext = createContext<FilterContextProps | undefined>(undefined)

interface FilterState {
    orders: { [key: string]: any }
    bids: { [key: string]: any }
}

const getDefaultFilters = (pageType: 'orders' | 'bids') => {
    const defaults: { [key: string]: any } = {}

    if (pageType === 'orders') {
        defaults.cargoType = ['wagon', 'container']
        defaults.status = [
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
        ]
        defaults.loadingMode = ['loading', 'unloading', 'moving']
    } else if (pageType === 'bids') {
        defaults.cargoType = ['wagon', 'container']
        defaults.status = ['active', 'waiting']
        defaults.loadingMode = ['loading', 'unloading', 'moving']
    }

    return defaults
}

const getPageTypeFromPathname = (pathname: string): 'orders' | 'bids' => {
    if (pathname.includes('/bids')) {
        return 'bids'
    } else if (pathname.includes('/orders')) {
        return 'orders'
    }

    return 'bids'
}

export function FilterProvider({ children, onFiltersChange }: FilterProviderProps) {
    const location = useLocation()
    const pathname = location.pathname
    const currentPageType = getPageTypeFromPathname(pathname)

    const [filterState, setFilterState] = useState<FilterState>({
        orders: getDefaultFilters('orders'),
        bids: getDefaultFilters('bids')
    })

    const debounceRef = useRef<NodeJS.Timeout | null>(null)
    const initializedRef = useRef<{ orders: boolean; bids: boolean }>({
        orders: false,
        bids: false
    })
    const previousPageTypeRef = useRef<'orders' | 'bids'>(currentPageType)

    useEffect(() => {
        const newPageType = getPageTypeFromPathname(pathname)

        if (!initializedRef.current[newPageType]) {
            setFilterState(prev => ({
                ...prev,
                [newPageType]: getDefaultFilters(newPageType)
            }))

            initializedRef.current[newPageType] = true

            if (onFiltersChange) {
                onFiltersChange(getDefaultFilters(newPageType), newPageType)
            }
        }

        previousPageTypeRef.current = newPageType
    }, [pathname, onFiltersChange])

    const handleFilterChange = useCallback(
        (columnId: string, value: any) => {
            const pageType = getPageTypeFromPathname(pathname)
            let formattedValue = value

            if (columnId === 'loadingMode' || columnId === 'cargoType' || columnId === 'status') {
                formattedValue = Array.isArray(value) ? value : [value]
            } else if ((columnId === 'loadingDate' || columnId === 'createdAt') && value) {
                formattedValue = {
                    start: new Date(value.from.setHours(23, 59, 59, 999)).toISOString(),
                    end: new Date(value.to.setHours(23, 59, 59, 999)).toISOString()
                }
            } else if (['number', 'fullPrice', 'comission', 'extraServicesPrice'].includes(columnId)) {
                formattedValue = Number(value)
            }

            const newFilters = {
                ...filterState[pageType],
                [columnId]: formattedValue
            }

            if (debounceRef.current) clearTimeout(debounceRef.current)
            debounceRef.current = setTimeout(() => {
                setFilterState(prev => ({
                    ...prev,
                    [pageType]: newFilters
                }))

                if (onFiltersChange) {
                    onFiltersChange(newFilters, pageType)
                }
            }, 500)
        },
        [filterState, onFiltersChange, pathname]
    )

    const clearFilters = useCallback(() => {
        const pageType = getPageTypeFromPathname(pathname)
        const defaultFilters = getDefaultFilters(pageType)

        setFilterState(prev => ({
            ...prev,
            [pageType]: defaultFilters
        }))

        if (onFiltersChange) {
            onFiltersChange(defaultFilters, pageType)
        }
    }, [pathname, onFiltersChange])

    const currentFilters = filterState[currentPageType]

    const setFilters = useCallback(
        (newFilters: { [key: string]: any }) => {
            const pageType = getPageTypeFromPathname(pathname)

            setFilterState(prev => ({
                ...prev,
                [pageType]: newFilters
            }))

            if (onFiltersChange) {
                onFiltersChange(newFilters, pageType)
            }
        },
        [pathname, onFiltersChange]
    )

    return (
        <FilterContext.Provider
            value={{
                filters: currentFilters,
                handleFilterChange,
                setFilters,
                clearFilters,
                pageType: currentPageType
            }}
        >
            {children}
        </FilterContext.Provider>
    )
}

export function useFilter() {
    const context = useContext(FilterContext)
    if (context === undefined) {
        throw new Error('useFilter must be used within a FilterProvider')
    }
    return context
}
