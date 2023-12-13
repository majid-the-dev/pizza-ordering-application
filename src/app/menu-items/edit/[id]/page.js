"use client"

import DeleteButton from '@/components/DeleteButton';
import { useProfile } from '@/components/UseProfile'
import Left from '@/components/icons/Left';
import EditableImage from "@/components/layout/EditableImage";
import MenuItemForm from '@/components/layout/MenuItemForm';
import UserTabs from "@/components/layout/UserTabs";
import Link from 'next/link';
import { redirect, useParams } from 'next/navigation';
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const EditMenuItemPage = () => {

    const { id } = useParams();
    const { loading, data } = useProfile();
    const [menuItem, setMenuItem] = useState(null);
    const [redirectToItems, setRedirectToItems] = useState(false);

    useEffect(() => {
        fetch('/api/menu-items').then(res => {
            res.json().then(items => {
                const item = items.find(i => i._id === id);
                setMenuItem(item);
            });
        });
    }, []);

    const handleFormSubmit = async (e, data) => {
        e.preventDefault();
        data = { ...data, _id: id };
        const savingPromise = new Promise(async (resolve, reject) => {
            const response = await fetch('/api/menu-items', {
                method: 'PUT',
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

    const handleDeleteClick = async () => {
        const promise = new Promise(async (resolve, reject) => {
            const response = await fetch('/api/menu-items?_id='+id, {
                method: 'DELETE'
            });
            if (response.ok) {
                resolve();
            } else {
                reject();
            }
        });

        await toast.promise(promise, {
            loading: 'Deleting menu item...',
            success: 'Deleted',
            error: 'Error deleting menu item'
        });

        setRedirectToItems(true);
    }

    if (redirectToItems) {
        return redirect('/menu-items')
    };

    if (loading) {
        return 'Loading user info...'
    };

    if (!data.admin) {
        return 'Not an admin'
    };

    return (
        <section className="mt-8">
            <UserTabs isAdmin={true} />
            <div className='max-w-2xl mx-auto mt-8'>
                <Link href={'/menu-items'} className='button'>
                    <Left />
                    <span>Show menu items</span>
                </Link>
            </div>
            <MenuItemForm menuItem={menuItem} onSubmit={handleFormSubmit} />
            <div className='max-w-md mx-auto mt-2'>
                <div className='max-w-xs ml-auto pl-4'>
                    <DeleteButton label={'Delete'} onDelete={handleDeleteClick} />
                </div>
            </div>
        </section>
    )
}

export default EditMenuItemPage;