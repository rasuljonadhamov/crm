import UserAuthForm from './components/user-auth-form'

export default function SignInPage() {
    return (
        <div className='relative h-screen  flex flex-col-reverse md:grid items-center justify-center  lg:max-w-none lg:grid-cols-2 lg:px-0'>
            <div className='relative  h-full  flex-col  p-10 text-white dark:border-r  lg:flex  lg:justify-center'>
                <img src='/logoRb.png' alt='logo' />
            </div>
            <div className='flex h-full items-center p-4 lg:p-8'>
                <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[370px]'>
                    <div className='flex flex-col space-y-2 text-center'>
                        <h1 className='text-2xl text-primary text-[39px] font-semibold tracking-tight'>
                            Добро пожаловать!
                        </h1>
                        <p>Введите данные для входа</p>
                    </div>
                    <UserAuthForm />
                </div>
            </div>
        </div>
    )
}
