import PopupModal from '@/components/shared/popup-modal'
import BidCreateForm from '../bid-create-form'

export default function BidsTableActions() {
    return (
        <div className='flex items-center justify-between gap-2 py-5'>
            <div className='flex gap-3'>
                <PopupModal renderModal={onClose => <BidCreateForm modalClose={onClose} />} />
            </div>
        </div>
    )
}
