import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FcGoogle } from 'react-icons/fc'
import useAuth from '../../hooks/useAuth'
import { getToken, saveUser } from '../../api/auth'
import toast from 'react-hot-toast'
import { TbFidgetSpinner } from 'react-icons/tb'
import { useRef } from 'react'

const Login = () => {
  const { signIn, signInWithGoogle, resetPassword, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const emailRef = useRef(null)
  // console.log(location.state.from.pathname); stored location in private route
  const from = location?.state?.from?.pathname || '/' //if exist the prev loc or go to home

  //form submit handler
  const handleSubmit = async event => {
    event.preventDefault();

    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;
    try {
      //1. User Login
      const result = await signIn(email, password)
      //5.get jwt token
      await getToken(result?.user?.email);
      navigate(from, { replace: true });
      toast.success('Login successful');

    } catch (err) {
      toast.error(err?.message);
    }



  }
  //using google signin
  const handleGoogleSignIn = async () => {
    try {

      const result = await signInWithGoogle();
      //4.save user data in database i.e result.user.email
      const dbResponse = await saveUser(result?.user);
      console.log(dbResponse);

      //5.get jwt token
      await getToken(result?.user?.email);
      navigate(from, { replace: true });
      toast.success('Login successful');

    } catch (err) {
      toast.error(err?.message);
    }
  }
  const HandleForgetPassword = () => {
    console.log('clicked', emailRef.current.value);
    resetPassword(emailRef.current.value)
      .then(() => {
        toast('Please Check your email....!',
          {
            icon: '📩',
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
            },
          }
        )
      })
      .catch(err => {
        toast.error(err)
      })
  }


  return (
    <div className='flex justify-center items-center min-h-screen'>
      <div className='flex flex-col max-w-md p-6 rounded-md sm:p-10 bg-gray-100 text-gray-900'>
        <div className='mb-8 text-center'>
          <h1 className='my-3 text-4xl font-bold'>Log In</h1>
          <p className='text-sm text-gray-400'>
            Sign in to access your account
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          noValidate=''
          action=''
          className='space-y-6 ng-untouched ng-pristine ng-valid'
        >
          <div className='space-y-4'>
            <div>
              <label htmlFor='email' className='block mb-2 text-sm'>
                Email address
              </label>
              <input
                type='email'
                name='email'
                id='email'
                ref={emailRef}
                required
                placeholder='Enter Your Email Here'
                className='w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-indigo-500 bg-gray-200 text-gray-900'
                data-temp-mail-org='0'
              />
            </div>
            <div>
              <div className='flex justify-between'>
                <label htmlFor='password' className='text-sm mb-2'>
                  Password
                </label>
              </div>
              <input
                type='password'
                name='password'
                autoComplete='current-password'
                id='password'
                required
                placeholder='*******'
                className='w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-indigo-500 bg-gray-200 text-gray-900'
              />
            </div>
          </div>
  
          <div>
            <button
              type='submit'
              className='bg-indigo-500 w-full rounded-md py-3 text-white'
            >
              {
                loading
                  ?
                  (<TbFidgetSpinner className='animate-spin mx-auto text-2xl' />)
                  :
                  ('Continue')
              }
            </button>
          </div>
        </form>
        <div className='space-y-1'>
          <span className='text-xs'>Forgot password?</span> <br />
          <button
            onClick={HandleForgetPassword}
            className='text-xs hover:underline hover:text-sky-500 text-gray-400'>
            Enter email and click <span className='text-rose-600 underline font-semibold'>Reset</span>
          </button>
        </div>
        <div className='flex items-center pt-4 space-x-1'>
          <div className='flex-1 h-px sm:w-16 dark:bg-gray-700'></div>
          <p className='px-3 text-sm dark:text-gray-400'>
            Login with social accounts
          </p>
          <div className='flex-1 h-px sm:w-16 dark:bg-gray-700'></div>
        </div>
        <div onClick={handleGoogleSignIn} className='flex justify-center items-center space-x-2 border m-3 p-2 border-gray-300 border-rounded cursor-pointer'>
          <FcGoogle size={32} />

          <p>Continue with Google</p>
        </div>
        <p className='px-6 text-sm text-center text-gray-400'>
          Don&apos;t have an account yet?{' '}
          <Link
            to='/signup'
            className='hover:underline hover:text-rose-500 text-gray-600'
          >
            Sign up
          </Link>
          .
        </p>
      </div>
    </div>
  )
}

export default Login
