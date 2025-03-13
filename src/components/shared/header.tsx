import { useState, useEffect } from 'react'
import { navItems } from '@/constants/data'
import { usePathname } from '@/routes/hooks'
import Heading from './heading'
import UserNav from './user-nav'
import { ModeToggle } from './theme-toggle'
import { RenderFilterMobile } from './render-filter-mobile'

const useMatchedPath = (pathname: string) => {
    const matchedPath =
        navItems.find(item => item.href === pathname) ||
        navItems.find(item => pathname.startsWith(item.href + '/') && item.href !== '/')
    return matchedPath?.title || ''
}

export default function Header() {
    const pathname = usePathname()
    const headingText = useMatchedPath(pathname)

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768)
        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <div className='flex flex-1 items-center justify-between bg-secondary px-4'>
            <Heading title={headingText} />
            <div className='ml-4 flex items-center md:ml-6'>
                <UserNav />
                <ModeToggle />
                {isMobile && <RenderFilterMobile />}
            </div>
        </div>
    )
}
