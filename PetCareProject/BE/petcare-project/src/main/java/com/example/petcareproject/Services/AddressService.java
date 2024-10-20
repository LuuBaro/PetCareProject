package com.example.petcareproject.Services;


import com.example.petcareproject.Model.Address;
import com.example.petcareproject.Repository.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AddressService {

    @Autowired
    private AddressRepository addressRepository;

    public Address addAddress(Address address) {
        if (address.getIsDefault()) {
            addressRepository.updateDefaultAddressForUser(address.getUser().getUserId());
        }
        return addressRepository.save(address);
    }

    public List<Address> getUserAddressesByUserId(Long userId) {
        return addressRepository.findByUserUserId(userId);
    }

    public Address saveAddress(Address address) {
        return addressRepository.save(address);
    }

    public Address updateAddress(Long addressId, Address updatedAddress) {
        // 1. Find the existing address
        Address existingAddress = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with id " + addressId));

        // 2. Update the fields of the existing address
        existingAddress.setStreet(updatedAddress.getStreet());
        existingAddress.setWard(updatedAddress.getWard());
        existingAddress.setDistrict(updatedAddress.getDistrict());
        existingAddress.setProvince(updatedAddress.getProvince());
        existingAddress.setFullAddress(updatedAddress.getFullAddress());

        // 3. If the updated address is set as default
        if (updatedAddress.getIsDefault()) {
            // a. Get all addresses for the user
            List<Address> userAddresses = addressRepository.findByUserUserId(existingAddress.getUser().getUserId());

            // b. Loop through the addresses and set isDefault to false for others
            for (Address address : userAddresses) {
                if (!address.getAddressId().equals(addressId)) { // Exclude the address being updated
                    address.setIsDefault(false);
                    addressRepository.save(address); // Save the changed address
                }
            }
        }

        // 4. Set the isDefault value for the updated address
        existingAddress.setIsDefault(updatedAddress.getIsDefault());

        // 5. Save the updated address
        return addressRepository.save(existingAddress);
    }
}
