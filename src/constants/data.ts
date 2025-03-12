import { NavItem } from '@/types'

export const navItems: NavItem[] = [
    {
        title: 'Заявки',
        href: '/bids',
        icon: 'dashboard',
        label: 'Dashboard'
    },
    {
        title: 'Заказы',
        href: '/orders',
        icon: 'user',
        label: 'Student'
    },
    {
        title: 'Выход',
        href: '/login',
        icon: 'login',
        label: 'Login'
    }
]


export type Employee = {
    id: number
    first_name: string
    last_name: string
    email: string
    phone: string
    gender: string
    date_of_birth: string 
    street: string
    city: string
    state: string
    country: string
    zipcode: string
    longitude?: number 
    latitude?: number 
    job: string
    profile_picture?: string | null 
}
