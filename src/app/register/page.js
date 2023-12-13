"use client"

import { signIn } from "next-auth/react";
import Image from "next/image"
import Link from "next/link";
import { useState } from "react"

const RegisterPage = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [creatingUser, setCreatingUser] = useState(false);
  const [userCreated, setUserCreated] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreatingUser(true);
    setError(false);
    setUserCreated(false);

    const response = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      setUserCreated(true)
    } else {
      setError(true);
    }

    setCreatingUser(false);
  }

  return (
    <section className="mt-8">
      <h1 className="text-center text-primary text-4xl mb-4">
        Register
      </h1>

      {userCreated && (
        <div className="my-4 text-center">
          User created.<br /> Now you can <Link href={'/login'} className="underline">Login &raquo;</Link>
        </div>
      )}

      {error && (
        <div className="my-4 text-center">
          Error creating user. <br />
          Please try again
        </div>
      )}

      <form className="block max-w-xs mx-auto" onSubmit={handleSubmit}>
        <input type="email" placeholder="email" value={email} onChange={e => setEmail(e.target.value)} disabled={creatingUser} />
        <input type="password" placeholder="password" value={password} onChange={e => setPassword(e.target.value)} disabled={creatingUser} />
        <button type="submit" disabled={creatingUser}>Register</button>
        <div className="my-4 text-center text-gray-500">or login with provider</div>
        <button onClick={() => signIn('google', {callbackUrl: '/'})} type="button" className="flex gap-4 items-center justify-center">
          <Image src={'/google.png'} width={24} height={24} alt="google-logo" />
          Login with google
        </button>
        <div className="text-center my-4 text-gray-500">
          Existing account? <Link href={'/login'} className="underline">Login here &raquo;</Link>
        </div>
      </form>
    </section>
  )
}

export default RegisterPage;