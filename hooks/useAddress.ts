import { useEffect, useState } from "react";
import { privateApi } from "@/lib/api/axios";
import { Address } from "@/types/user.types";

interface AddAddressData {
  userId: string;
  firstName: string;
  lastName: string;
  company?: string;
  address: string;
  country: string;
  city: string;
  zipCode: string;
  phone: string;
  isDefault?: boolean;
}

interface UpdateAddressData {
  firstName?: string;
  lastName?: string;
  company?: string;
  address?: string;
  country?: string;
  city?: string;
  zipCode?: string;
  phone?: string;
  isDefault?: boolean;
}

export const useAddress = (userId?: string) => {
  const [address, setAddress] = useState<string>("");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch default address for display (original functionality)
  useEffect(() => {
    if (!userId) return;

    const fetchDefaultAddress = async () => {
      try {
        const response = await privateApi.get<Address[]>(
          `/addresses?userId=${userId}&isDefault=true`
        );

        let addressData: Address[];
        if (response && typeof response === "object" && "data" in response) {
          addressData = response.data as Address[];
        } else {
          addressData = response as Address[];
        }

        if (addressData.length > 0) {
          const defaultAddress = addressData[0];
          setAddress(
            `${defaultAddress.address}, ${defaultAddress.city}, ${defaultAddress.country}`
          );
        }
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    };

    fetchDefaultAddress();
  }, [userId]);

  // Get all addresses for a user
  const getAddressesByUserId = async (
    targetUserId: string
  ): Promise<Address[] | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await privateApi.get<Address[]>(
        `/addresses?userId=${targetUserId}`
      );

      let addressData: Address[];
      if (response && typeof response === "object" && "data" in response) {
        addressData = response.data as Address[];
      } else {
        addressData = response as Address[];
      }

      setAddresses(addressData);
      return addressData;
    } catch (err: any) {
      const message = err.message || "Failed to fetch addresses";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get a specific address by ID
  const getAddressById = async (addressId: string): Promise<Address | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await privateApi.get<Address>(`/addresses/${addressId}`);

      let addressData: Address;
      if (response && typeof response === "object" && "data" in response) {
        addressData = response.data as Address;
      } else {
        addressData = response as Address;
      }

      if (!addressData || typeof addressData !== "object" || !addressData.id) {
        throw new Error("Invalid address data received");
      }

      return addressData;
    } catch (err: any) {
      const message = err.message || "Failed to fetch address";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Add new address
  const addAddress = async (data: AddAddressData): Promise<Address | null> => {
    try {
      setLoading(true);
      setError(null);

      const newAddressData = {
        ...data,
        company: data.company || "",
        isDefault: data.isDefault || false,
      };

      const response = await privateApi.post<Address>(
        "/addresses",
        newAddressData
      );

      let createdAddress: Address;
      if (response && typeof response === "object" && "data" in response) {
        createdAddress = response.data as Address;
      } else {
        createdAddress = response as Address;
      }

      if (!createdAddress) {
        throw new Error("Failed to create address");
      }

      // Refresh addresses list
      if (userId) {
        await getAddressesByUserId(userId);
      }

      return createdAddress;
    } catch (err: any) {
      const message = err.message || "Failed to add address";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update existing address
  const updateAddress = async (
    addressId: string,
    data: UpdateAddressData
  ): Promise<Address | null> => {
    try {
      setLoading(true);
      setError(null);

      // Get current address data first
      const currentResponse = await privateApi.get<Address>(
        `/addresses/${addressId}`
      );
      let currentData: Address;
      if (
        currentResponse &&
        typeof currentResponse === "object" &&
        "data" in currentResponse
      ) {
        currentData = currentResponse.data as Address;
      } else {
        currentData = currentResponse as Address;
      }

      // Merge current data with updates
      const updatedData = {
        ...currentData,
        ...data,
      };

      const updateResponse = await privateApi.put<Address>(
        `/addresses/${addressId}`,
        updatedData
      );
      let updatedAddress: Address;
      if (
        updateResponse &&
        typeof updateResponse === "object" &&
        "data" in updateResponse
      ) {
        updatedAddress = updateResponse.data as Address;
      } else {
        updatedAddress = updateResponse as Address;
      }

      // Refresh addresses list
      if (userId) {
        await getAddressesByUserId(userId);
      }

      return updatedAddress;
    } catch (err: any) {
      const message = err.message || "Failed to update address";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete address
  const deleteAddress = async (addressId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      await privateApi.delete(`/addresses/${addressId}`);

      // Refresh addresses list
      if (userId) {
        await getAddressesByUserId(userId);
      }

      return true;
    } catch (err: any) {
      const message = err.message || "Failed to delete address";
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    // Original functionality
    address,

    // New functionality
    addresses,
    loading,
    error,
    getAddressesByUserId,
    getAddressById,
    addAddress,
    updateAddress,
    deleteAddress,
  };
};
