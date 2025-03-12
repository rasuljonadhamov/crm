import { useState, useEffect } from 'react'

const CurrentTime = () => {
    const [time, setTime] = useState(new Date())

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date())
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    const formatTime = date => {
        const day = date.getDate()
        const month = date.toLocaleString('default', { month: 'long' })
        const year = date.getFullYear()
        const time = date.toLocaleTimeString()
        return `Сегодня ${day} ${month} ${year}.г ${time}`
    }

    return (
            <div className='text-center  px-5 py-3  '>
                <h1 className='text-[9px] md:text-[16px] font-bold text-gray-800'>{formatTime(time)}</h1>
            </div>
    )
}

export default CurrentTime
