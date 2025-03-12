import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useState } from 'react'
import { useRouter } from '@/routes/hooks'
import { Eye, EyeOff } from 'lucide-react'
import { fetchPrivateData, postData2 } from '@/api/api'

const formSchema = z.object({
    username: z.string().nonempty({ message: 'Введите логин' }),
    password: z.string().nonempty({ message: 'Введите пароль' })
})

type UserFormValue = z.infer<typeof formSchema>

export default function UserAuthForm() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const form = useForm<UserFormValue>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: '',
            password: ''
        }
    })

    const onSubmit = async (data: UserFormValue) => {
        try {

            setLoading(true)
            const params = new URLSearchParams()
            params.append('username', data.username)
            params.append('password', data.password)

            const response = await postData2<{ access_token: string }>("api/v1/auth/token", params);


            const token = response.access_token
            if (token) {
                localStorage.setItem('authToken', token)

                const userResponse = await fetchPrivateData<{ username: string }>("api/v1/auth/currentuser", token);

                localStorage.setItem('username', userResponse.username)
                // @ts-expect-error надо что то сделать
                localStorage.setItem('organizationName', userResponse.organizationName)

                router.push('/bids')
            }
        } catch (error) {
            console.error('Ошибка входа:', error)
            alert('Неверный логин или пароль')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-6'>
                <FormField
                    control={form.control}
                    name='username'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Логин</FormLabel>
                            <FormControl>
                                <Input
                                    className='py-6'
                                    type='text'
                                    placeholder='Введите логин...'
                                    disabled={loading}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                        <FormItem className='relative'>
                            <FormLabel>Пароль</FormLabel>
                            <FormControl>
                                <div className='relative'>
                                    <Input
                                        className='py-6 pr-10'
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder='Введите пароль...'
                                        disabled={loading}
                                        {...field}
                                    />
                                    <button
                                        type='button'
                                        className='absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700'
                                        onClick={() => setShowPassword(prev => !prev)}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button disabled={loading} className='ml-auto w-full p-6' type='submit'>
                    Вход
                </Button>
            </form>
        </Form>
    )
}
