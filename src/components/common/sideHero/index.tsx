const SideHero = ()=>{
    return (
        <div className='w-[40%] h-full bg-login-bg bg-cover bg-center flex flex-col items-center justify-between text-white p-8'>

        <div className='mt-10 justify-center items-center h-2/3'>
          <h1 className='text-3xl font-bold mb-2 text-center text-primary-green'>Welcome to</h1>
          <h1 className='text-7xl font-bold mb-2 text-center text-primary-green'>Tranzwave</h1>
          <div className='flex w-full justify-center items-center'>
            <p className='w-4/5 text-sm text-center text-primary-green'>
              Your one-stop solution for managing all your guests. Provide seamless journeys to your clients with our comprehensive platform.
            </p>
          </div>


          <div className='flex flex-col items-center'>
            {/* <Image
              src='/assets/icons/loader icon.png'
              alt='Tranzwave Logo'
              width={250}
              height={100}
              className='mb-4'
            /> */}
          </div>

        </div>

        <div className='mt-6 text-sm text-center'>

          © 2024 Tranzwave. All rights reserved.
        </div>
      </div>
    )
}

export default SideHero;