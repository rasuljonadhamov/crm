import { Suspense, lazy } from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'

import PrivateRoute from './PrivateRoute'

import { FilterProvider } from '@/context/filter-context'

const DashboardLayout = lazy(() => import('@/components/layout/dashboard-layout'))
const SignInPage = lazy(() => import('@/pages/auth/signin'))
const BidsPage = lazy(() => import('@/pages/bids'))
const OrderPage = lazy(() => import('@/pages/orders'))

import NotFound from '@/pages/not-found'

import { Loader2 } from 'lucide-react'

export default function AppRouter() {
    const Loader = () => (
        <div className="flex justify-center items-center h-screen">
            <Loader2 className="animate-spin text-gray-500" size={48} />
        </div>
    );
    const dashboardRoutes = [
        {
            path: '/',
            element: (
                <PrivateRoute>
                    <FilterProvider>
                        <DashboardLayout>
                            <Suspense fallback={<Loader />}>
                                <Outlet />
                            </Suspense>
                        </DashboardLayout>
                    </FilterProvider>
                </PrivateRoute>
            ),
            children: [
                {
                    index: true,
                    element: <Navigate to='bids' replace />
                },
                {
                    path: 'bids',
                    element: <BidsPage />,
                    index: true
                },
                {
                    path: 'orders',
                    element: <OrderPage />
                }
            ]
        }
    ]
    const publicRoutes = [
        {
            path: '/login',
            element: <SignInPage />,
            index: true
        },
        {
            path: '/404',
            element: <NotFound />
        },
        {
            path: '*',
            element: <Navigate to='/404' replace />
        }
    ]

    const routes = useRoutes([...dashboardRoutes, ...publicRoutes])

    return routes
}
