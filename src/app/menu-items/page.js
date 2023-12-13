"use client"

import { useProfile } from "@/components/UseProfile";
import Right from "@/components/icons/Right";
import UserTabs from "@/components/layout/UserTabs";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";


const MenuItemsPage = () => {

    const { loading, data } = useProfile();
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        fetch('/api/menu-items').then(res => {
            res.json().then(menuItems => {
                setMenuItems(menuItems);
            });
        });
    }, []);

    if (loading) {
        return 'Loading user info...'
    };

    if (!data.admin) {
        return 'Not an admin'
    };




    return (
        <section className="mt-8 max-w-2xl mx-auto">
            <UserTabs isAdmin={true} />
            <div className="mt-8">
                <Link href={'/menu-items/new'} className="button"><span>Create new menu item</span><Right /></Link>
            </div>
            <div>
                <h2 className="text-sm text-gray-500 mt-8">Edit menu item:</h2>
                <div className="grid grid-cols-3 gap-3">
                    {menuItems?.length > 0 && menuItems.map(item => (
                        <Link href={'/menu-items/edit/' + item._id} className="bg-gray-200 rounded-lg p-4">
                            <div className="relative">
                                <Image src={item.image} className="rounded-md" alt='Item image' width={200} height={200} />
                            </div>
                            <div className="text-center">
                                {item.name}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default MenuItemsPage;