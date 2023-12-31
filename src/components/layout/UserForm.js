"use client"

import { useState } from "react";
import EditableImage from "./EditableImage";
import { useProfile } from "../UseProfile";
import AddressInputs from "./AddressInputs";

const UserForm = ({ user, onSave }) => {

    const [userName, setUserName] = useState(user?.name || "");
    const [image, setImage] = useState(user?.image || "");
    const [phone, setPhone] = useState(user?.phone || "");
    const [streetAddress, setStreetAddress] = useState(user?.streetAddress || "");
    const [postalCode, setPostalCode] = useState(user?.postalCode || "");
    const [city, setCity] = useState(user?.city || "");
    const [country, setCountry] = useState(user?.country || "");
    const [admin, setAdmin] = useState(user?.admin || false);
    const { data: loggedInUserData } = useProfile();

    const handleAddressChange = (propName, value) => {
        if (propName === 'phone') setPhone(value); 
        if (propName === 'streetAddress') setStreetAddress(value); 
        if (propName === 'postalCode') setPostalCode(value); 
        if (propName === 'city') setCity(value); 
        if (propName === 'country') setCountry(value); 
    }

    return (
        <div className='flex gap-4'>
            <div>
                <div className='p-2 rounded-full relative max-w-[120px]'>
                    <EditableImage link={image} setLink={setImage} />
                </div>
            </div>
            <form className='grow' onSubmit={e => onSave(e, { name: userName, image, phone, admin, streetAddress, postalCode, city, country })}>
                <label>Full name</label>
                <input type="text" placeholder='Full name' value={userName} onChange={e => setUserName(e.target.value)} />

                <label>Email</label>
                <input type="email" placeholder='Email' disabled={true} value={user.email} />

                <AddressInputs addressProps={{phone, streetAddress, postalCode, city, country}} setAddressProps={handleAddressChange} />

                {loggedInUserData && (
                    <div>
                        <label htmlFor="adminCheckbox" className="p-2 mb-2 inline-flex items-center gap-2">
                            <input type="checkbox" id="adminCheckbox" className="mr-2" value={'1'} checked={admin} onClick={e => setAdmin(e.target.checked)} />
                            <span>Admin</span>
                        </label>
                    </div>
                )}

                <button type="submit">Save</button>
            </form>
        </div>
    )
}

export default UserForm