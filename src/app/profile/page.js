"use client"

import EditableImage from '@/components/layout/EditableImage';
import InfoBox from '@/components/layout/InfoBox';
import SuccessBox from '@/components/layout/SuccessBox';
import UserForm from '@/components/layout/UserForm';
import UserTabs from '@/components/layout/UserTabs';
import { useSession } from 'next-auth/react'
import { redirect } from 'next/dist/server/api-utils';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const ProfilePage = () => {

    const session = useSession();
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [profileFetched, setProfileFetched] = useState(false);
    const { status } = session;

    useEffect(() => {
        if (status === 'authenticated') {
            fetch('/api/profile').then(response => {
                response.json().then(data => {
                    setUser(data)
                    setIsAdmin(data.admin);
                    setProfileFetched(true);
                })
            })
        }
    }, [session, status]);

    const handleProfileInfoUpdate = async (e, data) => {
        e.preventDefault();

        await toast.promise(fetch('/api/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data) //note that "name" and "image" is gotten from the session object
        }), {
            loading: 'Saving...',
            success: 'Profile saved!',
            error: 'Failed to save profile!'
        })
    };

    if (status === 'loading' || !profileFetched) {
        return 'Loading...'
    };

    if (status === 'unauthenticated') {
        return redirect('/login')
    };

    return (
        <section className='mt-8'>
            <UserTabs isAdmin={isAdmin} />
            <div className='max-w-2xl mx-auto mt-8'>
                <UserForm user={user} onSave={handleProfileInfoUpdate} />
            </div>
        </section>
    )
}

export default ProfilePage