import React from 'react'
import { SignUp, Signup } from "@clerk/nextjs";

const signup = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
         <SignUp appearance={{ elements: { formButtonPrimary: "bg-blue-600 hover:bg-blue-700" } }} />
       </div>
  )
}

export default signup
