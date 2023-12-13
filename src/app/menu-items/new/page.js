"use client"

import { useProfile } from '@/components/UseProfile'
import Left from '@/components/icons/Left';
import EditableImage from "@/components/layout/EditableImage";
import MenuItemForm from '@/components/layout/MenuItemForm';
import UserTabs from "@/components/layout/UserTabs";
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useState } from "react";
import toast from "react-hot-toast";

const NewMenuItemPage = () => {

    const { loading, data } = useProfile();
    const [redirectToItems, setRedirectToItems] = useState(false);

    if (loading) {
        return 'Loading user info...'
    };

    if (!data.admin) {
        return 'Not an admin'
    }

    const handleFormSubmit = async (e, data) => {
        e.preventDefault();
        const savingPromise = new Promise(async (resolve, reject) => {
            const response = await fetch('/api/menu-items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                resolve();
            } else {
                reject();
            }
        });

        await toast.promise(savingPromise, {
            loading: 'Saving menu item...',
            success: 'Saved',
            error: 'Error saving menu item'
        });

        setRedirectToItems(true);

    };

    if (redirectToItems) {
        return redirect('/menu-items')
    }

    return (
        <section className="mt-8">
            <UserTabs isAdmin={true} />
            <div className='max-w-2xl mx-auto mt-8'>
                <Link href={'/menu-items'} className='button'>
                    <Left />
                    <span>Show menu items</span>
                </Link>
            </div>
            <MenuItemForm menuItem={null} onSubmit={handleFormSubmit} />
        </section>
    )
}

export default NewMenuItemPage;