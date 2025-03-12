import { Icons } from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import { NavItem } from '@/types'
import { Dispatch, SetStateAction } from 'react'
import { useSidebar } from '@/hooks/use-sidebar'
import { Tooltip, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { usePathname } from '@/routes/hooks'
import { Link } from 'react-router-dom'

interface DashboardNavProps {
    items: NavItem[]
    setOpen?: Dispatch<SetStateAction<boolean>>
    isMobileNav?: boolean
}

export default function DashboardNav({ items, setOpen, isMobileNav = false }: DashboardNavProps) {
    const path = usePathname()
    const { isMinimized } = useSidebar()

    if (!items?.length) {
        return null
    }

    return (
        <nav className='grid items-start relative z-[999] gap-2'>
            <TooltipProvider>
                {items.map((item, index) => {
                    const Icon = Icons[item.icon || 'arrowRight']
                    return (
                        item.href && (
                            <Tooltip key={index}>
                                <TooltipTrigger asChild className='relative z-50'>
                                    <Link
                                        to={item.disabled ? '/' : item.href}
                                        className={cn(
                                            'flex items-center relative  !z-50 gap-2  rounded-md py-2 text-sm font-medium hover:text-muted-foreground',
                                            path === item.href ? 'bg-white text-black hover:text-black' : 'transparent',
                                            item.disabled && 'cursor-not-allowed opacity-80'
                                        )}
                                        onClick={() => {
                                            if (setOpen) setOpen(false)
                                            if (item.href === '/login') {
                                                localStorage.removeItem('authToken')
                                            }
                                        }}
                                    >
                                        <Icon className={`ml-2.5 size-5`} />
                                        <span className='hidden md:block  relative !z-50'>
                                            {isMobileNav || (!isMinimized && !isMobileNav) ? (
                                                <span className='mr-2 truncate'>{item.title}</span>
                                            ) : (
                                                ''
                                            )}
                                        </span>
                                        <span className='block md:hidden relative !z-50'>
                                            <span className='mr-2 truncate'>{item.title}</span>
                                        </span>
                                    </Link>
                                </TooltipTrigger>
                                {/* <TooltipContent
                                    align='center'
                                    side='right'
                                    sideOffset={8}
                                    className={` !z-50 relative ${!isMinimized ? 'hidden' : 'inline-block'}`}
                                >
                                    {item.title}
                                </TooltipContent> */}
                            </Tooltip>
                        )
                    )
                })}
            </TooltipProvider>
        </nav>
    )
}
