import { fetchPrivateData } from '@/api/api'
import { createContext, useContext, useEffect, useState } from 'react'

const ServerTimeContext = createContext<number | null>(null)

export const useServerTime = () => useContext(ServerTimeContext)

interface ServerTimeResponse {
    currentTime: string;
}

export const ServerTimeProvider = ({ children }: { children: React.ReactNode }) => {
    const [serverTime, setServerTime] = useState<number | null>(null)
    const [lastSyncTime, setLastSyncTime] = useState<number | null>(null)

    useEffect(() => {
        const fetchTime = async () => {
            try {
                const token = localStorage.getItem("authToken");
                if (!token) return;
                
                const res = await fetchPrivateData("api/v1/time/now", token) as ServerTimeResponse;
                const parsedTime = new Date(res.currentTime).getTime();
                
                setServerTime(parsedTime);
                setLastSyncTime(Date.now()); 
            } catch (error) {
                console.error("❌ Error fetching time:", error);
            }
        };
    
        fetchTime();
        const interval = setInterval(fetchTime, 120000);
        return () => clearInterval(interval);
    }, []);

    
    useEffect(() => {
        if (!serverTime || !lastSyncTime) return;

        const interval = setInterval(() => {
            setServerTime(prev => prev !== null ? prev + 1000 : null);
        }, 1000);

        return () => clearInterval(interval);
    }, [serverTime, lastSyncTime]);

    return <ServerTimeContext.Provider value={serverTime}>{children}</ServerTimeContext.Provider>
}
