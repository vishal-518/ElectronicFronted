import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/cart/cartSlice";
import { addToWishlist } from "../../../redux/wishlist/wishlistSlice";
import { BsHeart, BsEye, BsStar, BsStarFill } from "react-icons/bs";
import { IoIosHeart } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";



const ExploreMoreProduct = () => {
    const [exprole, setexprole] = useState(false);
    const dispatch = useDispatch();
    const [wishlistClicked, setWishlistClicked] = useState({});

    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/productapi")
            .then((res) => {
                const data = res.data.productdata || res.data;
                setProducts(data);
            })
            .catch((err) => console.log(err));
    }, []);

    const handleAddToCart = (product) => {
        let token = localStorage.getItem('token')
        const productWithDelivery = { ...product, delivery: product.delivery || 0 };
        axios
            .post("http://localhost:5000/addtocart", productWithDelivery, { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => {
                if (res.data.status === 200) {
                    toast.success(res.data.msg);
                    setTimeout(() => window.location.reload(), 1500);
                } else {
                    toast.error(res.data.msg);
                }
            });
    };

    const handleToggleWishlist = (product) => {
        setWishlistClicked((prev) => ({
            ...prev,
            [product.id]: !prev[product.id],
        }));

        dispatch(
            addToWishlist({
                id: product.id,
                name: product.title,
                price: product.price,
                img: product.img,
            })
        );
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) =>
            i < (rating || 0) ? (
                <BsStarFill key={i} className="text-yellow-400" />
            ) : (
                <BsStar key={i} className="text-gray-300" />
            )
        );
    };

    let navigate = useNavigate()
     const datial = (product) => {
        console.log(product)
                navigate("/product", { state: product });

        // let token = localStorage.getItem('token');
        // axios.get(`http://localhost:5000/product/${product._id}`)
        //     .then((res) => {
        //         navigate("/product", { state: product });
        //     });
    };
    return (
        <div className="md:p-6 ">
            <Toaster position="top-right" reverseOrder={false} />
            <div className="mb-6">
                <span className="text-red-500 text-sm font-semibold flex items-center gap-2">
                    <span className="w-2 h-5 bg-red-500 rounded"></span>
                    Our Products
                </span>
                <h2 className="text-2xl font-bold mt-4 text-gray-900">
                    Explore Our Product
                </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 ">
                {(exprole ? products : products.slice(0, 4)).map((product) => (
                    <div
                        key={product.id}
                        className="border border-gray-300 rounded-lg p-4 flex flex-col items-center relative group w-full md:w-72 h-80 transition"
                    >

                        <button
                            onClick={() => handleToggleWishlist(product)}
                            className="absolute top-2 right-3 text-gray-500 opacity-0 group-hover:opacity-100 transition"
                        >
                            {wishlistClicked[product.id] ? <IoIosHeart className="text-red-400" size={20} /> : <BsHeart size={18} />}
                        </button>


                        <div className="w-36 h-32 rounded-md mb-3 flex items-center justify-center">
                            <img
                                src={product.product_img}
                                alt={product.name}
                                onClick={() => { datial(product) }}
                                className="w-full h-full mx-auto object-contain rounded-sm transform transition duration-500 hover:scale-110 hover:-translate-y-0.5 cursor-pointer"
                            />
                        </div>

                        {/* Title */}
                        <h3 className="font-semibold mt-2 text-center">
                            {product.product_name}
                        </h3>

                        {/* Price */}
                        <p className="mt-1 text-center">
                            <span className="font-bold text-red-500">
                                {product.product_price}
                            </span>{" "}
                            <span className="line-through text-gray-400">
                                {product.product_oldPrice}
                            </span>
                        </p>

                        {/* Rating */}
                        <div className="flex items-center mt-1">
                            {renderStars(product?.rating)}
                            <span className="ml-2 text-sm text-gray-500">
                                ({product?.reviews || 0})
                            </span>
                        </div>

                        {/* Add to Cart */}
                        <button
                            onClick={() => handleAddToCart(product)}
                            className="mt-3 w-full bg-black text-white text-sm py-2 rounded opacity-0 group-hover:opacity-100 cursor-pointer transition"
                        >
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-16 text-center">
                <button
                    onClick={() => setexprole(!exprole)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
                >
                    {exprole ? "View Less Product" : "View All Product"}
                </button>
            </div>
        </div>
    );
};

export default ExploreMoreProduct;
