import { useState } from 'react'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'

import { useFormContext, useWatch } from 'react-hook-form'

function TerminalTwo({ terminals, isReadOnly }: { terminals; isReadOnly?: boolean }) {
    const { control, setValue } = useFormContext()

    const loadingType = useWatch({ control, name: 'loadingType' })
    const transportType = useWatch({ control, name: 'transportType' })

    const [search, setSearch] = useState('')
    //@ts-expect-error надо что то сделать
    const [isOpen, setIsOpen] = useState(false)

    const getTerminalTitle = () => {
        if (transportType === 'Контейнер') return 'Сдать контейнер'
        if (transportType === 'Вагон' && loadingType === 'Погрузка') return 'Терминал погрузки'
        return 'Терминал 2'
    }
    const sortedTerminals = terminals
        ?.filter(
            t =>
                t.name.toLowerCase().includes(search.toLowerCase()) ||
                t.description?.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => a.name.localeCompare(b.name))

    return (
        <div>
            <h1 className='font-bold mb-2'>{getTerminalTitle()}</h1>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-4'>
              
                <FormField
                    control={control}
                    name='terminal2Id' 
                    rules={{ required: 'Пожалуйста, выберите терминал' }}
                    render={({ field }) => (
                        <FormItem>
                            <Select
                                disabled={isReadOnly}
                                onValueChange={value => {
                                    const selectedTerminal = terminals.find(t => t.id === Number(value))
                                    if (selectedTerminal) {
                                        field.onChange(selectedTerminal.id) 
                                        setValue('terminal2Name', selectedTerminal.name)
                                        setValue('terminal2Address', selectedTerminal.description || '')
                                    }
                                }}
                                value={field.value?.toString()} 
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder='Выберите терминал'>
                                        {terminals.find(t => t.id === field.value)?.name || ''}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent
                       
                                >
                                    <div className='p-2'>
                                        <Input
                                            placeholder='Поиск терминала...'
                                            value={search}
                                            onChange={e => setSearch(e.target.value)}

                                            onFocus={() => {
                                                setTimeout(() => setIsOpen(true), 300)
                                            }}
                                        
                                            onKeyDown={e => e.stopPropagation()}
                                            className='w-full border rounded-md'
                                        />
                                    </div>
                                    {sortedTerminals.map(terminal => (
                                        <SelectItem
                                            key={terminal.id}
                                            value={terminal.id.toString()}
                                        >
                                            {terminal.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name='terminal2Address'
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input disabled={isReadOnly} placeholder='Адрес' {...field} readOnly />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <Separator className='mt-8' />
        </div>
    )
}

export default TerminalTwo
