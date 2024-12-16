import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className='flex flex-col min-h-screen justify-center items-center
    bg-gradient-to-b from-indigo-600 to-purple-500'>
    <SignUp />
  </div>
  )
}