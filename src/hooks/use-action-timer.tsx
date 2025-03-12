import { useServerTime } from "@/context/server-time-context"
import { useEffect, useState } from "react"

const AuctionTimer = ({ activationTime }: { activationTime: string }) => {
  const serverTime = useServerTime() 
  const [syncTime, setSyncTime] = useState<number | null>(null)
  const [syncLocalTime, setSyncLocalTime] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState<number>(0)

  useEffect(() => {
    if (!serverTime) return
    const now = Date.now()
    setSyncTime(Math.floor(serverTime / 1000))
    setSyncLocalTime(Math.floor(now / 1000)) 
  }, [serverTime])

  useEffect(() => {
    if (syncTime === null || syncLocalTime === null) return

    const updateTimer = () => {
      const now = Math.floor(Date.now() / 1000)
      const simulatedServerTime = syncTime + (now - syncLocalTime) 
      const targetTime = Math.floor(new Date(activationTime).getTime() / 1000)
      setTimeLeft(Math.max(0, targetTime - simulatedServerTime))
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [syncTime, syncLocalTime, activationTime])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return <span>{timeLeft > 0 ? `${minutes}:${seconds.toString().padStart(2, '0')}` : 'Время вышло'}</span>
}

export default AuctionTimer
