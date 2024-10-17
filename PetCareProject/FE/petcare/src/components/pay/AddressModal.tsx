import React, {useEffect, useState} from "react";
import AddressForm from "./AddressForm";
import {getAddresses, updateAddress} from "../../service/AddressService";

interface AddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string | null;
    onAddressSelected: (addressId: number) => void;
    currentCheckoutAddressId: number | null;
}

const AddressModal: React.FC<AddressModalProps> = ({
                                                       isOpen,
                                                       onClose,
                                                       userId,
                                                       onAddressSelected,
                                                       currentCheckoutAddressId,
                                                   }) => {
    const [addresses, setAddresses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
        null
    );
    const [showForm, setShowForm] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        if (isOpen) {
            fetchAddresses(); // Fetch addresses when the modal opens
        }
    }, [isOpen, currentCheckoutAddressId, refreshTrigger]);

    const fetchAddresses = async () => {
        setIsLoading(true);
        try {
            const response = await getAddresses(userId);
            setAddresses(response);

            // Find the address that matches the current address ID
            const currentAddress = response.find(
                (address) => address.addressId === currentCheckoutAddressId
            );

            if (currentAddress) {
                setSelectedAddressId(currentAddress.addressId); // Set the ID directly
            } else if (response.length > 0) {
                // Find the default address if no currentCheckoutAddressId is provided
                const defaultAddress = response.find((address) => address.isDefault);
                if (defaultAddress) {
                    setSelectedAddressId(defaultAddress.addressId);
                } else {
                    setSelectedAddressId(response[0].addressId); // Fallback to the first address
                }
            }
        } catch (error) {
            console.error("Error fetching addresses:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        console.log("Selected Address ID:", selectedAddressId);
    }, [selectedAddressId]);

    const handleAddAddress = (newAddress: any) => {
        setAddresses((prev) => [...prev, newAddress]);
        setShowForm(false);
        setRefreshTrigger((prevTrigger) => prevTrigger + 1); // Trigger refresh
    };

    const handleUpdateAddress = async (addressId: number) => {
        // Pass addressId as argument
        try {
            const addressToUpdate = addresses.find(
                (address) => address.addressId === addressId
            );
            if (!addressToUpdate) {
                console.error("Address not found");
                return;
            }

            // 1. Update isDefault to true for the selected address
            const updatedAddress = {...addressToUpdate, isDefault: true};

            // 2. Call the API to update the address
            const response = await updateAddress(addressId, updatedAddress);

            // 3. Update the state with the response from the API
            if (response) {
                setAddresses((prev) =>
                    prev.map((address) =>
                        address.addressId === addressId ? response : address
                    )
                );
                setRefreshTrigger((prevTrigger) => prevTrigger + 1);
            } else {
                console.error("Failed to update address");
            }
        } catch (error) {
            console.error("Error updating address:", error);
        }
    };

    const handleAddressSelection = (id: number) => {
        // Ensure id is of type number
        setSelectedAddressId(id);
    };

    const handleConfirm = () => {
        if (selectedAddressId !== null) {
            // Check if an address is selected
            onAddressSelected(selectedAddressId);
            onClose();
        } else {
            // Handle the case where no address is selected (e.g., show an error message)
            alert("Vui lòng chọn địa chỉ giao hàng.");
        }
    };

    return (
        <div
            className={
                "modal max-w-md mx-auto bg-white p-4 rounded-md ${isOpen ? 'open' : ''}"
            }
        >
            <h2 className="text-lg font-semibold mb-4">Địa Chỉ Của Tôi</h2>
            {addresses.map((address) => (
                <div key={address.addressId} className="border-b pb-4 mb-4">
                    <div className="flex items-start mb-2">
                        <input
                            type="radio"
                            name="address"
                            className="mt-1 mr-2"
                            id={`address-${address.addressId}`}
                            checked={selectedAddressId === address.addressId}
                            onChange={() => handleAddressSelection(address.addressId)} // Pass address.id here
                        />
                        <label
                            htmlFor={`address-${address.addressId}`}
                            className="flex-grow"
                        >
                            <p className="text-sm text-gray-600">{address.street}</p>
                            <p className="text-sm text-gray-600">
                                {address.ward}, {address.district}, {address.province}
                            </p>
                        </label>
                        <button
                            onClick={() => handleUpdateAddress(address.addressId)}
                            className="text-blue-500"
                        >
                            Mặc định
                        </button>
                    </div>
                    {address.isDefault && ( // Conditionally render the span
                        <span
                            className="inline-block bg-red-100 text-red-500 border border-red-500 rounded px-2 py-1 text-xs mt-2">
              Mặc định
            </span>
                    )}
                </div>
            ))}

            <button
                onClick={() => setShowForm(true)}
                className="flex items-center text-blue-500 text-sm mb-4"
            >
                <i className="fas fa-plus mr-2"></i> Thêm Địa Chỉ Mới
            </button>
            {showForm && (
                <AddressForm
                    onSubmit={handleAddAddress}
                    onCancel={() => setShowForm(false)}
                    userId={userId}
                />
            )}
            <div className="flex justify-end mt-2">
                <button
                    onClick={onClose}
                    className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                >
                    Hủy
                </button>
                <button
                    onClick={handleConfirm}
                    className="bg-[#00b7c0] text-white px-4 py-2 rounded"
                >
                    Xác nhận
                </button>
            </div>
        </div>
    );
};

export default AddressModal;
