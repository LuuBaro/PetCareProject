import React, {useEffect, useState} from 'react';
import {getProvinces, getDistricts, getWards, addAddress} from '../../service/AddressService';

interface AddressFormProps {
    onSubmit: (newAddress: any) => void;
    onCancel: () => void;
    userId: string | null;
}

const AddressForm: React.FC<AddressFormProps> = ({onSubmit, onCancel, userId}) => {
    const [provinces, setProvinces] = useState<any[]>([]);
    const [districts, setDistricts] = useState<any[]>([]);
    const [wards, setWards] = useState<any[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<string>('');
    const [selectedDistrict, setSelectedDistrict] = useState<string>('');
    const [formData, setFormData] = useState({
        ward: '',
        address: '',
        isDefault: false
    });
    const [isLoadingProvinces, setIsLoadingProvinces] = useState<boolean>(true);
    const [isLoadingDistricts, setIsLoadingDistricts] = useState<boolean>(false);
    const [isLoadingWards, setIsLoadingWards] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value, type} = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const selectedDistrictObj = districts.find(d => d.DistrictID === parseInt(selectedDistrict, 10));
        const selectedWardObj = wards.find(w => w.WardCode === formData.ward);

        const addressData = {
            fullAddress: `${formData.address}, ${selectedWardObj?.WardName}, ${selectedDistrictObj?.DistrictName}, ${selectedProvince}`,
            street: formData.address,
            province: selectedProvince,
            district: selectedDistrictObj ? selectedDistrictObj.DistrictName : '',
            ward: selectedWardObj ? selectedWardObj.WardName : '',
            userId: {id: userId}
        };

        try {
            const result = await addAddress(addressData);
            if (result) {
                onSubmit(result);
            } else {
                console.error('Invalid address data');
            }
        } catch (error) {
            console.error('Error adding address:', error);
        }
    };

    const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedDistrictID = e.target.value;
        setSelectedDistrict(selectedDistrictID);
        setFormData(prevFormData => ({
            ...prevFormData,
            district: districts.find(d => d.DistrictID === parseInt(selectedDistrictID, 10))?.DistrictName || ''
        }));
        setWards([]);
    };

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const data = await getProvinces();
                setProvinces(data);
            } catch (error) {
                console.error('Error fetching provinces:', error);
            } finally {
                setIsLoadingProvinces(false);
            }
        };
        fetchProvinces();
    }, []);

    useEffect(() => {
        const fetchDistricts = async () => {
            if (selectedProvince) {
                setIsLoadingDistricts(true);
                const selectedProvinceData = provinces.find(p => p.ProvinceName === selectedProvince);
                const provinceId = selectedProvinceData ? selectedProvinceData.ProvinceID : null;

                if (provinceId) {
                    try {
                        const data = await getDistricts(provinceId);
                        setDistricts(data);
                    } catch (error) {
                        console.error('Error fetching districts:', error);
                        setDistricts([]);
                    }
                }
            } else {
                setDistricts([]);
            }
            setIsLoadingDistricts(false);
        };
        fetchDistricts();
    }, [selectedProvince, provinces]);

    useEffect(() => {
        const fetchWards = async () => {
            if (selectedDistrict) {
                setIsLoadingWards(true);
                const districtId = parseInt(selectedDistrict, 10);
                try {
                    const data = await getWards(districtId);
                    setWards(data);
                } catch (error) {
                    console.error('Error fetching wards:', error);
                    setWards([]);
                }
                setIsLoadingWards(false);
            } else {
                setWards([]);
            }
        };
        fetchWards();
    }, [selectedDistrict]);

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow-md">
            <div className="mb-4">
                <label htmlFor="province" className="block text-sm font-medium text-gray-700">
                    Tỉnh/Thành phố:
                </label>
                <select
                    id="province"
                    name="province"
                    value={selectedProvince}
                    onChange={(e) => {
                        setSelectedProvince(e.target.value);
                        setSelectedDistrict('');
                        setFormData(prev => ({...prev, ward: ''}));
                    }}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                >
                    <option value="">Chọn tỉnh/thành phố</option>
                    {provinces.map(province => (
                        <option key={province.ProvinceID} value={province.ProvinceName}>{province.ProvinceName}</option>
                    ))}
                </select>
                {isLoadingProvinces && <p className="text-sm text-gray-500">Đang tải danh sách tỉnh/thành phố...</p>}
            </div>

            <div className="mb-4">
                <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                    Quận/Huyện:
                </label>
                <select
                    id="district"
                    name="district"
                    value={selectedDistrict}
                    onChange={handleDistrictChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                    disabled={!selectedProvince}
                >
                    <option value="">Chọn quận/huyện</option>
                    {districts.map(district => (
                        <option key={district.DistrictID} value={district.DistrictID}>{district.DistrictName}</option>
                    ))}
                </select>
                {isLoadingDistricts && <p className="text-sm text-gray-500">Đang tải danh sách quận/huyện...</p>}
            </div>

            <div className="mb-4">
                <label htmlFor="ward" className="block text-sm font-medium text-gray-700">
                    Phường/Xã:
                </label>
                <select
                    id="ward"
                    name="ward"
                    value={formData.ward}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                    disabled={!selectedDistrict}
                >
                    <option value="">Chọn phường/xã</option>
                    {isLoadingWards && <option disabled>Đang tải...</option>}
                    {wards.map(ward => (
                        <option key={ward.WardCode} value={ward.WardCode}>{ward.WardName}</option>
                    ))}
                </select>
                {!isLoadingWards && selectedDistrict && wards.length === 0 &&
                    <p className="text-red-500 text-sm">Không tìm thấy phường/xã.</p>}
            </div>

            <div className="mb-4">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Địa chỉ cụ thể:
                </label>
                <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                />
            </div>

            <div className="flex justify-end mt-6">
                <button
                    type="button"
                    onClick={onCancel}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
                >
                    Trở Lại
                </button>
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Hoàn thành
                </button>
            </div>
        </form>
    );
};

export default AddressForm;
