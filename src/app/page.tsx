"use client";
import { useEffect, useState } from "react";

interface Product {
    id: number;
    name: string;
    price: number;
}

interface CartItem extends Product {
    quantity: number;
}

function Page() {
    const [products] = useState<Product[]>([
        { id: 1, name: "Laptop", price: 500 },
        { id: 2, name: "Smartphone", price: 300 },
        { id: 3, name: "Headphones", price: 100 },
        { id: 4, name: "Smartwatch", price: 150 },
    ]);

    const [cart, setCart] = useState<CartItem[]>([]);
    const freeGiftThreshold = 1000;
    const freeGift = { id: 99, name: "Wireless Mouse", price: 0 };

    useEffect(() => {
        console.log("Cart updates", cart);
    }, [cart]);

    const addToCart = (product: Product) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === product.id);
            if (existingItem) {
                return prevCart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    const addQuantity = (id: number, quantity: number) => {
        setCart((prevCart) =>
            prevCart.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item))
        );
    };

    const removeQuantity = (id: number, quantity: number) => {
        console.log("remove", id, quantity);

        setCart((prevCart) =>
            prevCart.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item))
        );
    };

    const removeItem = (id: number) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    };

    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const progress = Math.min((totalAmount / freeGiftThreshold) * 100, 100);

    //for setting the gift into cart
    useEffect(() => {
        if (totalAmount >= 1000) {
            setCart((prevCart) => {
                if (!prevCart.some((item) => item.id === freeGift.id)) {
                    return [...prevCart, { ...freeGift, quantity: 1 }];
                }
                return prevCart;
            });
        } else {
            setCart((prevCart) => prevCart.filter((item) => item.id !== freeGift.id));
        }
    }, [totalAmount,freeGift]);

    return (
        <div className="flex justify-center">
            <div className="min-h-screen w-1/2 bg-slate-200  my-3 rounded-xl">
                <div className="flex flex-col">
                    <div className="flex justify-center">
                        <h1 className="text-2xl font-bold my-5">Shopping Cart</h1>
                    </div>
                    <div className="flex flex-col ">
                        {/* Products */}
                        <div className="px-10 p-2 ">
                            <div className="text-xl font-semibold py-3">Products</div>
                            <div className="flex justify-between">
                                {products.map((product) => (
                                    <div
                                        key={product.id}
                                        className="w-[10rem] bg-white rounded-xl shadow-xl p-2 flex flex-col gap-y-2"
                                    >
                                        <div>{product.name}</div>
                                        <div>${product.price}</div>
                                        <button
                                            onClick={() => addToCart(product)}
                                            className="bg-blue-500 hover:bg-blue-400 text-sm text-white p-2 px-4 rounded-md"
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="px-10 p-2 ">
                            <div className="text-xl font-semibold py-3">Cart Summary</div>
                            <div className="bg-white rounded-lg p-3">
                                <div className=" flex justify-between">
                                    <div>Subtotal</div>
                                    <div>${totalAmount}</div>
                                </div>
                                <hr />

                                <div className="bg-blue-200 rounded-lg h-[4rem] mt-2 p-3">
                                    {totalAmount >= freeGiftThreshold
                                        ? "You earned a free gift"
                                        : `Add ${1000 - totalAmount} more to get a free wireless mouse`}
                                </div>
                                <div style={{ height: "10px", width: "100%", background: "yellow", marginTop: "10px" }}>
                                    <div style={{ height: "10px", width: `${progress}%`, background: "green" }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="px-10 p-2 ">
                            {cart.length === 0 ? (
                                <div className="bg-white rounded-lg p-3">
                                    <div>
                                        <div className="flex flex-col justify-center items-center">
                                            <div>Your cart is empty</div>
                                            <div className="text-slate-500 text-sm">
                                                add some products to see them here!
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                cart.map((item) => (
                                    <div key={item.id} className="bg-white rounded-lg p-3">
                                        <div>
                                            <div className="flex justify-between">
                                                <div className="flex flex-col">
                                                    <div>{item.name}</div>
                                                    <div className="text-sm text-slate-500">
                                                        ${item.price}*{item.quantity} = ${item.price * item.quantity}
                                                    </div>
                                                </div>
                                                {item.id !== freeGift.id ? (
                                                    <div className="">
                                                        {/* remove */}
                                                        <button
                                                            onClick={() => removeQuantity(item.id, item.quantity - 1)}
                                                            className="p-3 bg-red-500"
                                                        >
                                                            -
                                                        </button>
                                                        {item.quantity}
                                                        {/* add */}
                                                        <button
                                                            onClick={() => addQuantity(item.id, item.quantity + 1)}
                                                            className="p-3 bg-green-500"
                                                        >
                                                            +
                                                        </button>
                                                        <button onClick={() => removeItem(item.id)} className="p-3">
                                                            Remove
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div>Offer item</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page;
