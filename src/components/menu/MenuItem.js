"use client"

import toast from "react-hot-toast";
import { CartContext } from "../AppContext"
import { useContext, useState } from "react"
import MenuItemTile from "./MenuItemTile";
import Image from "next/image";


const MenuItem = (menuItem) => {

    const {
        image,
        name,
        description,
        basePrice,
        sizes,
        extraIngredientPrices
    } = menuItem;

    const [selectedSize, setSelectedSize] = useState(sizes?.[0] || null);
    const [selectedExtras, setSelectedExtras] = useState([]);

    const [showPopup, setShowPopup] = useState(false);

    const { addToCart } = useContext(CartContext);

    const handleAddToCartButtonClick = () => {
        const hasOptions = sizes.length > 0 || extraIngredientPrices.length > 0;
        if (hasOptions && !showPopup) {
            setShowPopup(true);
            return;
        }
        addToCart(menuItem, selectedSize, selectedExtras);
        setShowPopup(false);
        toast.success('Added to cart!');
    };

    const handleExtraThingClick = (e, extraThing) => {
        const checked = e.target.checked;
        if (checked) {
            setSelectedExtras(prev => [...prev, extraThing]);
        } else {
            setSelectedExtras(prev => {
                return prev.filter(e => e.name !== extraThing.name);
            });
        };
    };

    let selectedPrice = basePrice;
    if (selectedPrice) {
        selectedPrice += selectedSize?.price;
    }
    if (selectedExtras?.length > 0) {
        for (const extra of selectedExtras) {
            selectedPrice += extra?.price;
        }
    }

    return (
        <>
            {showPopup && (
                <div onClick={() => setShowPopup(false)} className="fixed inset-0 bg-black/80 flex items-center justify-center">
                    <div onClick={e => e.stopPropagation()} className="my-8 bg-white p-2 rounded-lg max-w-md">
                        <div className="overflow-y-scroll p-2" style={{ maxHeight: 'calc(100vh - 100px)' }}>
                            <Image src={image} alt={name} className="mx-auto" width={300} height={200} />
                            <h2 className="text-lg font-bold text-center mb-2">{name}</h2>
                            <p className="text-center text-gray-500 text-sm mb-2">{description}</p>
                            {sizes?.length > 0 && (
                                <div className="py-2">
                                    <h3 className="text-center text-gray-700">Pick your size</h3>
                                    {sizes.map(size => (
                                        <label className="flex items-center gap-2 p-2 border rounded-md mb-2">
                                            <input type="radio" name="size" onClick={() => setSelectedSize(size)} checked={selectedSize?.name === size.name} />
                                            {size.name} ${basePrice + size.price}
                                        </label>
                                    ))}
                                </div>
                            )}
                            {extraIngredientPrices?.length > 0 && (
                                <div className="py-2">
                                    <h3 className="text-center text-gray-700">Any extras?</h3>
                                    {extraIngredientPrices.map(extraThing => (
                                        <label key={extraThing._id} className="flex items-center gap-2 p-2 border rounded-md mb-2">
                                            <input type="checkbox" name={extraThing.name} onChange={e => handleExtraThingClick(e, extraThing)} checked={selectedExtras.map(e => e._id).includes(extraThing._id)} />
                                            {extraThing.name} +${extraThing.price}
                                        </label>
                                    ))}
                                </div>
                            )}
                            <button onClick={handleAddToCartButtonClick} className="primary sticky bottom-0" type="button">Add to cart ${selectedPrice}</button>
                            <button type="button" onClick={() => setShowPopup(false)} className="mt-2">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            <MenuItemTile onAddToCart={handleAddToCartButtonClick} {...menuItem} />
        </>
    )
}

export default MenuItem;