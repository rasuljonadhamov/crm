import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { ScrollArea } from '../ui/scroll-area'

type TPopupModalProps = {
    onConfirm?: () => void
    loading?: boolean
    renderModal: (onClose: () => void) => React.ReactNode
}
export default function PopupModal({ renderModal }: TPopupModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const onClose = () => setIsOpen(false)
    return (
        <>
            <Button variant='tertiary' className='text-[23px] md:text-sm  py-6 md:py-0 w-full' onClick={() => setIsOpen(true)}>
                <Plus className='mr-2 h-6 w-6 md:h-4 md:w-4' /> Новая заявка
            </Button>
            <Modal isOpen={isOpen} onClose={onClose} className={'!bg-background !p-0 w-full h-full md:h-[90vh] md:w-[1200px]'}>
                <ScrollArea className='h-[95dvh] md:h-[87dvh] md:px-6 px-0  '>{renderModal(onClose)}</ScrollArea>
            </Modal>
        </>
    )
}
