import React, { useState } from "react";
import { buyNow, getAddress, saveAddress } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Lottie from "lottie-react";
import loader from "../assets/loader2.json";
import { useTheme } from "../context/ThemeContext";

const CheckoutPage = () => {

    const { productId } = useParams();

    const [formData, setFormData] = useState({
        addressId: "",
        fullName: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        pinCode: "",
        country: "India"
    });

    const [loading, setLoading] = useState(false);
    const {isDark} = useTheme();

    const [originalAddress, setOriginalAddress] = useState(null);

    const [errors, setErrors] = useState({});

    const { user } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        let newErrors = {};

        if (!formData.fullName) newErrors.fullName = "Full name is required";
        if (!/^\d{10}$/.test(formData.phone))
            newErrors.phone = "Enter valid 10 digit phone number";
        if (!formData.addressLine1)
            newErrors.addressLine1 = "Address is required";
        if (!formData.city) newErrors.city = "City is required";
        if (!formData.state) newErrors.state = "State is required";
        if (!/^\d{6}$/.test(formData.pinCode))
            newErrors.pinCode = "Enter valid 6 digit pincode";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    const isAddressChanged = () => {
        if (!originalAddress) return true;

        return JSON.stringify(formData) !== JSON.stringify(originalAddress);
    };

    const onSubmit = async (data) => {
        try {

            setLoading(true);
            let addressId = formData.addressId;

            if (isAddressChanged() || !originalAddress?.addressId) {

                const addRes = await saveAddress({
                    userId: user._id,
                    fullName: data.fullName,
                    phone: data.phone,
                    addressLine1: data.addressLine1,
                    addressLine2: data.addressLine2,
                    city: data.city,
                    state: data.state,
                    pinCode: data.pinCode,
                    country: data.country
                });

                addressId = addRes?.data?.address?._id;

                setFormData(prev => ({
                    ...prev,
                    addressId
                }));
            }

            const res = await buyNow({
                productId,
                quantity: 1,
                addressId
            });

            if (res?.data?.url) {
                window.location.href = res.data.url;
            }


        } catch (error) {
            console.log(error);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 2000);
        }
    };

    useEffect(() => {
        const fetchAddress = async () => {
            const res = await getAddress({ userId: user._id })
            console.log(res)
            const address = res?.data?.address
            setFormData({
                addressId: address._id || "",
                fullName: address.fullName || "",
                phone: address.phone || "",
                addressLine1: address.addressLine1 || "",
                addressLine2: address.addressLine2 || "",
                city: address.city || "",
                state: address.state || "",
                pinCode: address.pinCode || "",
                country: address.country || "India"
            })

            setOriginalAddress({
                addressId: address._id || "",
                fullName: address.fullName || "",
                phone: address.phone || "",
                addressLine1: address.addressLine1 || "",
                addressLine2: address.addressLine2 || "",
                city: address.city || "",
                state: address.state || "",
                pinCode: address.pinCode || "",
                country: address.country || "India"
            })
        }
        fetchAddress();
    }, []);

    return (
        <div className="w-full lg:min-h-[calc(100dvh-112px)] md:min-h-[calc(100dvh-80px)] min-h-[calc(100dvh-112px)] md:p-5">
            <div className={`max-w-2xl mx-auto p-6 rounded-xl ${isDark? "bg-gray-900 shadow-[0px_0px_20px_rgba(0,0,0,0.4)]" : "bg-white shadow-[0px_0px_12px_rgba(0,0,0,0.2)]"}`}>
                <h2 className={`text-2xl font-semibold mb-6 ${isDark? "text-white" : "text-gray-800"}`}>Shipping Address</h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Full Name */}
                    <div>
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Full Name"
                            value={formData.fullName}
                            onChange={handleChange}
                            className={`border-2 p-3 w-full rounded-xl  outline-none ${isDark ? "border-gray-700 text-gray-200 placeholder:text-gray-500" : "bg-white border-gray-200 text-gray-700 placeholder:text-gray-400"}`}
                        />
                        {errors.fullName && (
                            <p className="text-red-500 text-sm">{errors.fullName}</p>
                        )}
                    </div>

                    {/* Phone */}
                    <div>
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={handleChange}
                            className={`border-2 p-3 w-full rounded-xl  outline-none ${isDark ? "border-gray-700 text-gray-200 placeholder:text-gray-500" : "bg-white border-gray-200 text-gray-700 placeholder:text-gray-400"}`}
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-sm">{errors.phone}</p>
                        )}
                    </div>

                    {/* Address Line 1 */}
                    <div>
                        <input
                            type="text"
                            name="addressLine1"
                            placeholder="House No, Street, Area"
                            value={formData.addressLine1}
                            onChange={handleChange}
                            className={`border-2 p-3 w-full rounded-xl  outline-none ${isDark ? "border-gray-700 text-gray-200 placeholder:text-gray-500" : "bg-white border-gray-200 text-gray-700 placeholder:text-gray-400"}`}
                        />
                        {errors.addressLine1 && (
                            <p className="text-red-500 text-sm">{errors.addressLine1}</p>
                        )}
                    </div>

                    {/* Address Line 2 */}
                    <input
                        type="text"
                        name="addressLine2"
                        placeholder="Landmark (Optional)"
                        value={formData.addressLine2}
                        onChange={handleChange}
                        className={`border-2 p-3 w-full rounded-xl  outline-none ${isDark ? "border-gray-700 text-gray-200 placeholder:text-gray-500" : "bg-white border-gray-200 text-gray-700 placeholder:text-gray-400"}`}
                    />

                    {/* City + State */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <input
                                type="text"
                                name="city"
                                placeholder="City"
                                value={formData.city}
                                onChange={handleChange}
                                className={`border-2 p-3 w-full rounded-xl  outline-none ${isDark ? "border-gray-700 text-gray-200 placeholder:text-gray-500" : "bg-white border-gray-200 text-gray-700 placeholder:text-gray-400"}`}
                            />
                            {errors.city && (
                                <p className="text-red-500 text-sm">{errors.city}</p>
                            )}
                        </div>

                        <div>
                            <input
                                type="text"
                                name="state"
                                placeholder="State"
                                value={formData.state}
                                onChange={handleChange}
                                className={`border-2 p-3 w-full rounded-xl  outline-none ${isDark ? "border-gray-700 text-gray-200 placeholder:text-gray-500" : "bg-white border-gray-200 text-gray-700 placeholder:text-gray-400"}`}
                            />
                            {errors.state && (
                                <p className="text-red-500 text-sm">{errors.state}</p>
                            )}
                        </div>
                    </div>

                    {/* Pincode */}
                    <div>
                        <input
                            type="text"
                            name="pinCode"
                            placeholder="Pincode"
                            value={formData.pinCode}
                            onChange={handleChange}
                            className={`border-2 p-3 w-full rounded-xl  outline-none ${isDark ? "border-gray-700 text-gray-200 placeholder:text-gray-500" : "bg-white border-gray-200 text-gray-700 placeholder:text-gray-400"}`}
                        />
                        {errors.pinCode && (
                            <p className="text-red-500 text-sm">{errors.pinCode}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full min-h-12 border-2 hover:bg-[#fc8479] bg-[#FF6F61] border-[#ff3e2d]  relative text-white py-3 rounded-lg transition cursor-pointer disabled:cursor-not-allowed flex justify-center items-center shadow-md"
                        disabled={loading}
                    >
                        {loading ?
                            <Lottie
                                animationData={loader}
                                loop={true}
                                className="w-50 h-50 absolute "
                            /> :
                            <span className="font-semibold">Continue to Payment</span>
                        }
                    </button>

                </form>
            </div>
        </div>
    );
};

export default CheckoutPage;