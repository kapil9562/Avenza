import React, { useState } from "react";
import { buyNow, getAddress, saveAddress } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

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
                userId: user._id,
                productId,
                quantity: 1,
                addressId
            });

            console.log(res);

            if (res?.data?.url) {
                window.location.href = res.data.url;
            }

        } catch (error) {
            console.log(error);
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
        <div className="w-full min-h-150 pb-20 md:p-5">
            <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl">
                <h2 className="text-2xl font-semibold mb-6">Shipping Address</h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Full Name */}
                    <div>
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Full Name"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.pinCode && (
                            <p className="text-red-500 text-sm">{errors.pinCode}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
                    >
                        Continue to Payment
                    </button>

                </form>
            </div>
        </div>
    );
};

export default CheckoutPage;