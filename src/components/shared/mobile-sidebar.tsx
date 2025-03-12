import DashboardNav from '@/components/shared/dashboard-nav'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { navItems } from '@/constants/data'
import { Dispatch, SetStateAction } from 'react'
import { Link } from 'react-router-dom'

type TMobileSidebarProps = {
    className?: string
    setSidebarOpen: Dispatch<SetStateAction<boolean>>
    sidebarOpen: boolean
}
export default function MobileSidebar({ setSidebarOpen, sidebarOpen }: TMobileSidebarProps) {
    return (
        <>
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetContent side='left' className='bg-background !px-0'>
                    <div className='space-y-4 py-4'>
                        <div className='space-y-4 px-3 py-2'>
                            <Link to='/' className='flex items-center gap-2 px-2 py-2 font-bold '>
                                <img src='/logoRb.png' alt='logo' className='h-12' />
                                <span>
                                    <span className='text-[#03b4e0]'>Биржа</span> Грузоперевозок
                                </span>
                            </Link>

                            <div className='space-y-1 px-2'>
                                <DashboardNav items={navItems} setOpen={setSidebarOpen} />
                            </div>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </>
    )
}
