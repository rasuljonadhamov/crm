import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

interface OrderRouteProps {
    formData: any
}

export function OrderRoute({ formData }: OrderRouteProps) {
    console.log('loadingTime:', formData.buyBid?.loadingTime)

    console.log('formData', formData)

    return (
        <>
            <div className='bg-cyan-500 text-[20px] flex py-2 px-6 text-white justify-between'>
                <div>
                    <p className='font-bold'>
                        Дата погрузки {new Date(formData.buyBid.loadingDate).toLocaleDateString('ru-RU')}
                    </p>
                </div>
                <div>
                    <p className='font-bold'>
                        Срок доставки {new Date(formData.buyBid.loadingDate).toLocaleDateString('ru-RU')}
                    </p>
                </div>
            </div>

            <div className='flex items-center gap-4 px-10'>
                <p className='font-bold text-[20px]'>Тип перевозки</p>
                <RadioGroup className='flex items-center gap-6 ml-12' defaultValue={formData.loadingMode}>
                    <p className='flex items-center gap-2'>
                        {formData.buyBid.cargoType === 'container' ? 'Контейнер' : 'Вагон'}
                        <RadioGroupItem
                            className='size-8'
                            value='loadingMode'
                            id='loadingMode'
                            checked={true}
                            disabled
                        />
                    </p>
                    <p className='flex items-center gap-2'>
                        {formData.buyBid?.loadingMode === 'loading'
                            ? 'Погрузка'
                            : formData.buyBid?.loadingMode === 'moving'
                              ? 'Перемещение'
                              : 'Выгрузка'}
                        <RadioGroupItem
                            className='size-8'
                            value='loadingMode'
                            id='loadingMode'
                            checked={true}
                            disabled
                        />
                    </p>
                </RadioGroup>
            </div>

            <div className='flex justify-between items-center px-10'>
                <div className='flex justify-between items-center gap-16'>
                    <p className='font-bold text-[20px]'>Время подачи</p>
                    <p>
                        {formData.buyBid?.loadingTime
                            ? (() => {
                                  const [hours, minutes] = formData.buyBid.loadingTime.split(':').map(Number)
                                  const date = new Date()
                                  date.setHours(hours, minutes, 0, 0)
                                  return format(date, 'HH.mm', { locale: ru })
                              })()
                            : '—'}
                    </p>
                </div>
                <div className='flex justify-between items-center gap-4'>
                    <p className='font-bold text-[20px]'>Профиль ТС</p>
                    <p>{formData.buyBid.vehicleProfile.name}</p>
                </div>
            </div>

            <div className='bg-cyan-500 flex py-2 px-6 text-white justify-center'>
                <p className='text-[20px] font-bold'>Маршрут</p>
            </div>

            <div className='px-10'>
                <p className='text-[20px] font-bold'>Терминал 1</p>
                <div className='grid grid-cols-2 gap-16'>
                    <div>
                        <Input value={formData.buyBid.terminal1.cityName || ''} className='mt-1' readOnly />
                    </div>
                    <div>
                        <Input value={formData.buyBid.terminal1.address || ''} className='mt-1' readOnly />
                    </div>
                </div>
            </div>

            <div className='px-10'>
                <p className='text-[20px] font-bold'>Склад клиента</p>
                <div className='grid grid-cols-2 gap-16'>
                    <div>
                        <Input value={formData.buyBid?.warehouses?.[0]?.cityName || ''} className='mt-1' readOnly />
                    </div>
                    <div>
                        <Input value={formData.buyBid?.warehouses?.[0]?.address || ''} className='mt-1' readOnly />
                    </div>
                </div>
            </div>

            <div className='px-10'>
                <p className='text-[20px] font-bold'>Терминал 2</p>
                <div className='grid grid-cols-2 gap-16'>
                    <div>
                        <Input
                            value={formData.buyBid.terminal2 ? formData.buyBid?.terminal2?.cityName : ''}
                            className='mt-1'
                            readOnly
                        />
                    </div>
                    <div>
                        <Input
                            value={formData.buyBid.terminal2 ? formData.buyBid.terminal2.address : ''}
                            className='mt-1'
                            readOnly
                        />
                    </div>
                </div>
            </div>

            <div className='bg-cyan-500 flex py-2 px-6 text-white justify-center items-center gap-6'>
                <p className='text-[20px] font-bold'>Транспорт</p>
                <p>{formData.buyBid.vehicleProfile.name}</p>
            </div>

            <div className='flex justify-between px-10'>
                <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                        <p className='font-bold'>Водитель</p>
                        <input
                            type='text'
                            value={formData.driverUser?.fio}
                            className='border ml-3 border-gray-300 rounded px-2 py-1 text-sm'
                            readOnly
                        />
                    </div>
                    <div className='flex items-center justify-between'>
                        <p className='font-bold'>Машина</p>
                        <input
                            type='text'
                            value={formData.assignedVehicle?.plateNum}
                            className='border ml-3 border-gray-300 rounded px-2 py-1 text-sm'
                            readOnly
                        />
                    </div>
                    <div className='flex items-center justify-between'>
                        <p className='font-bold'>Прицеп</p>
                        <input
                            type='text'
                            value={formData.assignedTrailer?.plateNum}
                            className='border ml-3 border-gray-300 rounded px-2 py-1 text-sm'
                            readOnly
                        />
                    </div>
                </div>
                <div>
                    <img src='/map.png' alt='map' />
                </div>

                <div className='space-y-2'>
                    {/* <div className='flex items-center justify-between'>
                        <p className='font-bold'>Файлы</p>
                        <button value='Ссылка на файл'>
                            <a
                                href={`mailto:${formData.customer.assignedDriverFiles}`}
                                className='border ml-3 border-gray-300 w-[185px] rounded px-2 py-1 text-sm flex justify-center text-primary underline'
                            >
                                Ссылка на файл
                            </a>
                        </button>
                    </div> */}
                    <div className='flex flex-col md:flex-row gap-2 items-center'>
                        <p className='font-bold mb-2'>Файлы</p>
                        {formData.assignedDriverFiles?.map(file => (
                            <a
                                key={file.id}
                                href={file.link}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='border border-gray-300 rounded px-2 py-1 text-sm text-primary underline mb-1'
                            >
                                {file.name}
                            </a>
                        ))}
                    </div>

                    <div className='flex flex-col md:flex-row gap-2 items-center'>
                        <p className='font-bold mb-2'>Файлы</p>
                        {formData.assignedTrailerFiles?.map(file => (
                            <a
                                key={file.id}
                                href={file.link}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='border border-gray-300 rounded px-2 py-1 text-sm text-primary underline mb-1'
                            >
                                {file.name}
                            </a>
                        ))}
                    </div>
                    <div className='flex flex-col md:flex-row gap-2 items-center'>
                        <p className='font-bold mb-2'>Файлы</p>
                        {formData.assignedVehicleFiles?.map(file => (
                            <a
                                key={file.id}
                                href={file.link}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='border border-gray-300 rounded px-2 py-1 text-sm text-primary underline mb-1'
                            >
                                {file.name}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
