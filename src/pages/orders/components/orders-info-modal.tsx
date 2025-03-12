import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import useNumberFormatter from '@/hooks/use-format-number'
import { OrderRoute } from './info-modal-details/order-route'
import { OrderHeader } from './info-modal-details/order-header'
import { OrderFinancial } from './info-modal-details/order-financial'
import { OrderContacts } from './info-modal-details/order-contacts'

function OrderInfoModal({ isModalOpen, handleCloseModal, selectedBid }) {
    const { formatNumber } = useNumberFormatter()
    const [formData, setFormData] = useState({
        ...selectedBid
    })

    const handleChange = e => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
            <DialogTrigger asChild>
                <Button variant='outline'>Open Order</Button>
            </DialogTrigger>
            <DialogContent className='max-h-[90vh] max-w-[1000px] overflow-y-auto !p-0'>
                <OrderHeader formData={formData} handleChange={handleChange} setFormData={setFormData} />

                <div className='grid gap-6'>
                    <OrderRoute formData={formData} />
                    <OrderFinancial formData={formData} formatNumber={formatNumber} setFormData={setFormData} />
                    <OrderContacts formData={formData} />

                    <div className='flex justify-center gap-4 py-6'>
                        <Button className='bg-orange-500 hover:bg-orange-600 text-white' onClick={handleCloseModal}>
                            Закрыть
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default OrderInfoModal
