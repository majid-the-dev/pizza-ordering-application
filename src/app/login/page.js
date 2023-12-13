"use client"

import Image from "next/image";
import { useState } from "react";
import { signIn } from 'next-auth/react'

const LoginPage = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginInProgress, setLoginInProgress] = useState(false)
    
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoginInProgress(true);
        await signIn('credentials', {email, password, callbackUrl: '/'});
        setLoginInProgress(false);
    }

    return (
        <section className="mt-8">
            <h1 className="text-center text-primary text-4xl mb-4">
                Login
            </h1>
            <form className="max-w-xs mx-auto" onSubmit={handleFormSubmit}>
                <input type="email" placeholder="email" name="email" value={email} onChange={e => setEmail(e.target.value)} disabled={loginInProgress} />
                <input type="password" placeholder="password" name="password" value={password} onChange={e => setPassword(e.target.value)} disabled={loginInProgress} />
                <button type="submit" disabled={loginInProgress}>Login</button>
                <div className="my-4 text-center text-gray-500">or login with provider</div>
                <button onClick={() => signIn('google', {callbackUrl: '/'})} type="button" className="flex gap-4 items-center justify-center">
                    <Image src={'/google.png'} width={24} height={24} alt="google-logo" />
                    Login with google
                </button>
            </form>
        </section>
    )
}

export default LoginPage