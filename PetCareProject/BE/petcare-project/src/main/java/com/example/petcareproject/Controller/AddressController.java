package com.example.petcareproject.Controller;


import com.example.petcareproject.dto.AddressRequestDTO;
import com.example.petcareproject.Model.Address;
import com.example.petcareproject.Model.User;
import com.example.petcareproject.Services.UserService;
import com.example.petcareproject.Services.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@CrossOrigin(origins = "http://localhost:5173")
public class AddressController {

    @Autowired
    private AddressService addressService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<?> addAddress(@RequestBody AddressRequestDTO addressDTO) {
        try {
            if (addressDTO.getUserId() == null) {
                return ResponseEntity.badRequest().body("User ID is missing");
            }
            User user = userService.findByUserUserId(addressDTO.getUserId());
            if (user == null) {
                return ResponseEntity.badRequest().body("User not found");
            }

            // Proceed with saving the address
            Address address = new Address();
            address.setStreet(addressDTO.getStreet());
            address.setWard(addressDTO.getWard());
            address.setDistrict(addressDTO.getDistrict());
            address.setProvince(addressDTO.getProvince());
            address.setFullAddress(addressDTO.getFullAddress());
            address.setUser(user);

            addressService.saveAddress(address);
            return ResponseEntity.ok("Address saved successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while saving the address: " + e.getMessage());
        }
    }

    @GetMapping
    public List<Address> getUserAddresses(@RequestParam Long userId) {
        return addressService.getUserAddressesByUserId(userId);
    }

    @GetMapping("/first")
    public ResponseEntity<?> getFirstUserAddress(@RequestParam Long userId) {
        List<Address> addresses = addressService.getUserAddressesByUserId(userId);

        if (addresses.isEmpty()) {
            return ResponseEntity.notFound().build(); // Return 404 if no addresses found
        }

        // Find the default address
        Address defaultAddress = addresses.stream()
                .filter(Address::getIsDefault) // Use getIsDefault() method
                .findFirst()
                .orElse(null);

        if (defaultAddress != null) {
            return ResponseEntity.ok(defaultAddress); // Return the default address
        } else {
            // If no default, return the first one
            return ResponseEntity.ok(addresses.getFirst());
        }
    }

    @PutMapping("/{addressId}")
    public ResponseEntity<?> updateAddress(
            @PathVariable Long addressId,
            @RequestBody Address updatedAddress) {

        try {
            Address updated = addressService.updateAddress(addressId, updatedAddress);
            return ResponseEntity.ok(updated);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while updating the address: " + e.getMessage());
        }
    }
}