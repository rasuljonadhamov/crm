import type React from 'react'
import { DialogHeader } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { useEffect, useState } from 'react'

const statusTranslations = {
    new: 'Новый',
    canceledByCarrierWithPenalty: 'Отменяется перевозчиком (половина ГО)',
    canceledByCustomerWithPenalty: 'Отменяется заказчиком (половина ГО)',
    canceledByCarrier: 'Отменяется перевозчиком',
    canceledByCustomer: 'Отменяется заказчиком',
    failed: 'Сорван',
    failing: 'Срывается',
    completed: 'Выполнен',
    inTransit: 'Машина в пути',
    canceled: 'Отменен',
    headingToLoading: 'Еду на погрузку',
    loading: 'На погрузке',
    unloading: 'На выгрузке',
    delivered: 'Груз сдан'
}

interface OrderHeaderProps {
    formData: any
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    setFormData: any
}

export function OrderHeader({ formData, handleChange, setFormData }: OrderHeaderProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [_, setIsChecked] = useState(!!formData.docSubmissionDate)

    useEffect(() => {
        setIsChecked(!!formData.docSubmissionDate)
    }, [formData.docSubmissionDate])

    const handleDocSubmissionChange = async (checked: boolean) => {
        if (isSubmitting) return

        setIsChecked(checked)

        try {
            setIsSubmitting(true)
            console.log('Submitting document status change:', checked)

            const token = localStorage.getItem('authToken')
            if (!token) {
                console.error('Не найден токен авторизации')
                setIsChecked(!checked)
                return
            }

            const response = await fetch(
                `https://portal.bgruz.com/api/v1/orders/${formData.id}/doc_submission_status?doc_submitted=${checked}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            if (!response.ok) {
                throw new Error(`Failed to update document submission status: ${response.status}`)
            }

            const responseData = await response.json()

            setFormData(prev => {
                const { responseText } = responseData || {}
                const newState = {
                    ...prev,
                    docSubmissionDate: responseText?.docSubmissionDate ?? prev.docSubmissionDate,
                    docSubmissionUser: responseText?.fio ?? prev.docSubmissionUser
                }
                console.log('Updated form data:', newState)
                return newState
            })
        } catch (error) {
            console.error('Error updating document submission:', error)
            setIsChecked(!checked)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <DialogHeader>
                <div>
                    <div className='mb-6 mt-3 px-6'>
                        <span className='rounded bg-orange-500 px-4 py-2 text-sm text-white mt-3'>
                            {statusTranslations[formData.status] || formData.status || '—'}
                        </span>
                    </div>
                    <div className='flex justify-center items-center w-full'>
                        <div className='flex items-center gap-4 w-full justify-center'>
                            <span className='text-[#03B4E0] w-[33%] flex justify-center text-[22px] font-semibold'>
                                CM ID {formData.buyBid.persistentId}
                            </span>
                            <span className='text-[40px] w-[33%] text-[#EE6F2D] flex justify-center border-x-2 px-14 border-[#EE6F2D] font-bold'>
                                Заказ
                            </span>
                            <span className='text-[#03B4E0] text-[22px] flex font-semibold justify-center mx-auto w-[33%]'>
                                ID {formData.id} от {new Date(formData.createdAt).toLocaleDateString('ru-RU')}
                            </span>
                        </div>
                    </div>
                </div>
            </DialogHeader>

            <div className='bg-cyan-500 flex py-2 px-6 text-white'>
                <div>
                    <p className='font-bold text-[20px]'>Статус заказа</p>
                </div>
            </div>

            <div className='grid gap-6'>
                <div className='flex justify-between px-10'>
                    <div className='flex justify-between items-center gap-4'>
                        <p className='font-bold'>Статус заказа:</p>
                        <p>{statusTranslations[formData.status] || formData.status || '—'}</p>
                    </div>
                    <div className='flex justify-between items-center gap-4'>
                        <p className='font-bold'>Изменено</p>
                        <p>{new Date(formData.statusUpdated).toLocaleString('ru-RU')}</p>
                    </div>
                </div>
            </div>

            <div className='flex justify-between items-center px-10'>
                <div className='flex justify-between items-center gap-4'>
                    <p className='font-bold'>Документы сданы:</p>
                    <p className='flex items-center gap-2'>
                        <Checkbox
                            checked={!!formData.docSubmissionDate}
                            disabled={isSubmitting}
                            onCheckedChange={handleDocSubmissionChange}
                        />
                        {formData.docSubmissionDate
                            ? new Date(formData.docSubmissionDate).toLocaleString('ru-RU')
                            : 'Не сданы'}
                    </p>
                </div>
                <div className='flex justify-between items-center gap-4 relative -left-14'>
                    <p className='font-bold'>Изменено</p>
                    <p>
                        <p>{formData.docSubmissionUser?.fio ? formData.docSubmissionUser?.fio : 'Не изменено'}</p>
                    </p>
                </div>
            </div>
        </>
    )
}
