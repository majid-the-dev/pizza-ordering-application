"use client"

import DeleteButton from '@/components/DeleteButton';
import { useProfile } from '@/components/UseProfile'
import UserTabs from '@/components/layout/UserTabs'
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const CategoriesPage = () => {

    const [categoryName, setCategoryName] = useState('');
    const [categories, setCategories] = useState([]);
    const { loading: profileLoading, data: profileData } = useProfile();
    const [editedCategory, setEditedCategory] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = () => {
        fetch('/api/categories').then(res => {
            res.json().then(categories => {
                setCategories(categories)
            });
        });
    };

    if (profileLoading) {
        return 'Loading user info...'
    };

    if (!profileData.admin) {
        return 'Not an admin'
    };

    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        const creationPromise = new Promise(async (resolve, reject) => {
            const data = { name: categoryName };
            if (editedCategory) {
                data._id = editedCategory._id;
            }
            const response = await fetch('/api/categories', {
                method: editedCategory ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            setCategoryName('');
            fetchCategories();
            setEditedCategory(null);
            if (response.ok) {
                resolve();
            } else {
                reject();
            }
        });
        toast.promise(creationPromise, {
            loading: editedCategory ? 'Updating category...' : 'Creating new category...',
            success: editedCategory ? 'Category updated' : 'New category created!',
            error: editedCategory ? 'Failed to update category' : 'Failed to create category!'
        })

    };

    const handleDeleteClick = async (_id) => {
        const promise = new Promise(async (resolve, reject) => {
            const response = await fetch('/api/categories?_id='+_id, {
                method: 'DELETE',
            });
            if (response.ok) {
                resolve();
            } else {
                reject();
            }
        });

        await toast.promise(promise, {
            loading: 'Deleting category...',
            success: 'Category deleted successfully!',
            error: 'Failed to delete category!'
        });

        fetchCategories();
    }

    return (
        <section className='max-w-2xl mx-auto mt-8'>
            <UserTabs isAdmin={true} />

            <form className='mt-8' onSubmit={handleCategorySubmit}>
                <div className='flex gap-2 items-end'>
                    <div className='grow'>
                        <label>
                            {editedCategory ? 'Update category' : 'New category name'}
                            {editedCategory && (
                                <>: <b>{editedCategory.name}</b></>
                            )}
                        </label>
                        <input type="text" value={categoryName} onChange={e => setCategoryName(e.target.value)} />
                    </div>
                    <div className='pb-3.5 flex gap-2'>
                        <button type="submit">{editedCategory ? 'Update' : 'Create'}</button>
                        <button type='button' onClick={() => {setEditedCategory(null), setCategoryName('')}}>Cancel</button>
                    </div>
                </div>
            </form>
            <div>
                <h2 className='mt-8 text-sm text-gray-500'>Existing categories</h2>
                {categories?.length > 0 && categories.map(c => (
                    <div className='bg-gray-100 rounded-xl p-2 px-4 flex gap-1 mb-2 items-center'>
                        <div className='grow cursor-pointer'>{c.name}</div>
                        <div className='flex gap-1'>
                            <button type="button" onClick={() => { setEditedCategory(c); setCategoryName(c.name) }}>Edit</button>
                            <DeleteButton label={'Delete'} onDelete={() => handleDeleteClick(c._id)} />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default CategoriesPage