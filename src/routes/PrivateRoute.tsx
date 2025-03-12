import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

interface PrivateRouteProps {
    children: ReactNode
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const token = localStorage.getItem('authToken')

    if (!token) {
        return <Navigate to='/login' replace />
    }

    return <>{children}</>
}

export default PrivateRoute
