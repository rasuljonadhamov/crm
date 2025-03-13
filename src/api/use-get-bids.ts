import { useState, useCallback, useEffect, useRef } from 'react'
import { postData2 } from '@/api/api'
import { useFilter } from '@/context/filter-context'

interface Bid {
    _id?: string
    client: { organizationName: string }
    cargoTitle: string
    price: number | null
    status: string | null
}

interface BidFilter {
    [key: string]: any
}

export const useGetBids = (size = 20) => {
    const [bids, setBids] = useState<Bid[] | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [hasMore, setHasMore] = useState<boolean>(true)
    const [page, setPage] = useState<number>(1) 
    const { filters } = useFilter()

    const prevFiltersRef = useRef<BidFilter>({})
    const filtersRef = useRef<BidFilter>({})
    const isMounted = useRef(false)
    const abortControllerRef = useRef<AbortController | null>(null)
    const observer = useRef<IntersectionObserver | null>(null)
    const isFetchingRef = useRef(false);
    

    const fetchBids = useCallback(async (force = false, append = false) => {
        
        if (loading || isFetchingRef.current) return;
       
        setLoading(true)
        isFetchingRef.current = true;
        setError(null);

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController

        try {
            const token = localStorage.getItem('authToken') || ''
            const currentFilters = filtersRef.current
            const isFiltersChanged = JSON.stringify(prevFiltersRef.current) !== JSON.stringify(currentFilters)

            if (!force && !isFiltersChanged && !append) {
                setLoading(false)
                return
            }

            prevFiltersRef.current = currentFilters

            const response = await postData2<{ items: Bid[]; total: number }>(
                'api/v1/bids/getbatch',
                { size, filter: currentFilters, page }, 
                token
            )

            setBids(prev => append && prev ? [...prev, ...response.items] : response.items)
            setHasMore(response.items.length === size && response.items.length < response.total)
        } catch (err) {
            console.error('Ошибка при загрузке заявок:', err)
            setError('Не удалось загрузить заявки. Попробуйте позже.')
        } finally {
            setLoading(false)
            isFetchingRef.current = false; 
        }
    }, [size, page])

    useEffect(() => {
        filtersRef.current = filters;
    
        if (isMounted.current) {
            setPage(1);
            fetchBids(true);
        } else {
            isMounted.current = true;
            fetchBids();
        }
    }, [filters]);

    const refreshBids = useCallback(() => {
        setPage(1)
        fetchBids(true)
    }, [fetchBids])

    const lastBidRef = useCallback((node: HTMLDivElement) => {
        if (loading || !hasMore) return;
    
        if (observer.current) observer.current.disconnect();
    
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !isFetchingRef.current) {
                console.log("Fetching more bids...");
                setTimeout(() => {
                    setPage(prev => prev + 1);
                }, 300);
            }
        }, {
            root: null,
            rootMargin: '100px',
            threshold: 0.1
        });
    
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);
    

    useEffect(() => {
        fetchBids(false, true);
    }, [page]);

    return {
        bids,
        loading,
        error,
        hasMore,
        refreshBids,
        lastBidRef
    }
}