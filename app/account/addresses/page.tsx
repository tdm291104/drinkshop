"use client";

import BreadcrumbComponent from "@/components/breadcrumb/BreadcrumbComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { FormLabel } from "@/components/ui/form-label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import titleleftdark from "@/public/Image_Rudu/titleleft-dark.png";
import { useAddress } from "@/hooks/useAddress";
import { useUserStore } from "@/stores/user.store";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import { Address } from "@/types/user.types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const addAddressSchema = z.object({
  firstName: z.string().min(1, "Vui lòng nhập tên"),
  lastName: z.string().min(1, "Vui lòng nhập họ"),
  company: z.string().optional(),
  address: z.string().min(1, "Vui lòng nhập địa chỉ"),
  city: z.string().min(1, "Vui lòng nhập thành phố"),
  country: z.string().min(1, "Vui lòng chọn quốc gia"),
  zipCode: z.string().min(1, "Vui lòng nhập mã bưu chính"),
  phone: z.string().min(1, "Vui lòng nhập số điện thoại"),
  isDefault: z.boolean(),
});

type AddAddressFormValues = z.infer<typeof addAddressSchema>;

export default function AddressesPage() {
  const { user: currentUser } = useUserStore();
  const {
    addresses,
    loading,
    getAddressesByUserId,
    addAddress,
    updateAddress,
    deleteAddress,
  } = useAddress(currentUser?.id);

  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [editedAddress, setEditedAddress] = useState<Partial<Address>>({});
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const addForm = useForm<AddAddressFormValues>({
    resolver: zodResolver(addAddressSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      company: "",
      address: "",
      city: "",
      country: "Việt Nam",
      zipCode: "",
      phone: "",
      isDefault: false,
    },
  });

  // Load addresses when component mounts
  useEffect(() => {
    if (currentUser?.id) {
      getAddressesByUserId(currentUser.id);
    }
  }, [currentUser?.id]);

  // Handle edit address
  const handleEditAddress = (address: Address) => {
    setEditingAddressId(address.id);
    setEditedAddress({
      firstName: address.firstName,
      lastName: address.lastName,
      company: address.company,
      address: address.address,
      city: address.city,
      country: address.country,
      zipCode: address.zipCode,
      phone: address.phone,
      isDefault: address.isDefault,
    });
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingAddressId(null);
    setEditedAddress({});
  };

  // Handle update address
  const handleUpdateAddress = async (addressId: string) => {
    try {
      const updatedAddress = await updateAddress(addressId, editedAddress);
      if (updatedAddress) {
        toast.success("Cập nhật địa chỉ thành công!");
        setEditingAddressId(null);
        setEditedAddress({});
      }
    } catch (error) {
      toast.error("Cập nhật địa chỉ thất bại!");
    }
  };

  // Handle input change
  const handleInputChange = (field: string, value: string | boolean) => {
    setEditedAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle add new address
  const handleAddAddress = async (data: AddAddressFormValues) => {
    try {
      if (!currentUser?.id) return;

      const newAddress = await addAddress({
        userId: currentUser.id,
        ...data,
        company: data.company || "",
      });

      if (newAddress) {
        toast.success("Thêm địa chỉ thành công!");
        setIsAddDialogOpen(false);
        addForm.reset();
      }
    } catch (error) {
      toast.error("Thêm địa chỉ thất bại!");
    }
  };

  // Handle delete address
  const handleDeleteAddress = async (addressId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) {
      const success = await deleteAddress(addressId);
      if (success) {
        toast.success("Xóa địa chỉ thành công!");
      }
    }
  };

  return (
    <div className="flex flex-col items-start py-4">
      <Toaster position="top-right" richColors />

      <BreadcrumbComponent
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Tài khoản của tôi", href: "/account" },
          { label: "Địa chỉ" },
        ]}
      />

      <div className="my-6">
        <h1 className="text-2xl font-semibold mb-2">ĐỊA CHỈ</h1>
        <Image src={titleleftdark} alt="Underline" width={70} height={20} />
      </div>

      <div className="w-full">
        {/* Existing addresses section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">ĐỊA CHỈ CỦA BẠN</h2>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-transparent text-cyan-500 underline underline-offset-2 hover:bg-transparent cursor-pointer">
                  Thêm địa chỉ
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>THÊM ĐỊA CHỈ MỚI</DialogTitle>
                </DialogHeader>

                <Form {...addForm}>
                  <form
                    onSubmit={addForm.handleSubmit(handleAddAddress)}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      {/* First Name */}
                      <FormField
                        control={addForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>Tên</FormLabel>
                            <FormControl>
                              <Input {...field} className="rounded-none" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Last Name */}
                      <FormField
                        control={addForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>Họ & tên đệm</FormLabel>
                            <FormControl>
                              <Input {...field} className="rounded-none" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Company */}
                    <FormField
                      control={addForm.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Công ty</FormLabel>
                          <FormControl>
                            <Input {...field} className="rounded-none" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Address */}
                    <FormField
                      control={addForm.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Địa chỉ</FormLabel>
                          <FormControl>
                            <Input {...field} className="rounded-none" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      {/* City */}
                      <FormField
                        control={addForm.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>Thành phố</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <SelectTrigger className="rounded-none">
                                  <SelectValue placeholder="Chọn thành phố" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Hà Nội">Hà Nội</SelectItem>
                                  <SelectItem value="Hồ Chí Minh">
                                    Hồ Chí Minh
                                  </SelectItem>
                                  <SelectItem value="Đà Nẵng">
                                    Đà Nẵng
                                  </SelectItem>
                                  <SelectItem value="Hải Phòng">
                                    Hải Phòng
                                  </SelectItem>
                                  <SelectItem value="Cần Thơ">
                                    Cần Thơ
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Country */}
                      <FormField
                        control={addForm.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>Quốc gia</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <SelectTrigger className="rounded-none">
                                  <SelectValue placeholder="Chọn quốc gia" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Việt Nam">
                                    Việt Nam
                                  </SelectItem>
                                  <SelectItem value="Thái Lan">
                                    Thái Lan
                                  </SelectItem>
                                  <SelectItem value="Singapore">
                                    Singapore
                                  </SelectItem>
                                  <SelectItem value="Malaysia">
                                    Malaysia
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Zip Code */}
                      <FormField
                        control={addForm.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>Postal/Zip Code</FormLabel>
                            <FormControl>
                              <Input {...field} className="rounded-none" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Phone */}
                      <FormField
                        control={addForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>Phone</FormLabel>
                            <FormControl>
                              <Input {...field} className="rounded-none" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Default checkbox */}
                    <FormField
                      control={addForm.control}
                      name="isDefault"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="border-gray-500 size-3 rounded-none"
                            />
                          </FormControl>
                          <FormLabel className="text-sm !mt-0">
                            Đặt làm địa chỉ mặc định
                          </FormLabel>
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end gap-4 pt-4">
                      <Button
                        type="button"
                        onClick={() => setIsAddDialogOpen(false)}
                        className="bg-black text-white hover:bg-gray-700 rounded-none px-6 py-2"
                      >
                        Hủy
                      </Button>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="bg-cyan-400 text-white hover:bg-cyan-500 rounded-none px-6 py-2"
                      >
                        {loading ? "Đang thêm..." : "Thêm địa chỉ"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Address forms */}
          <div className="grid grid-cols-2 gap-12">
            {addresses.map((address) => {
              const isEditing = editingAddressId === address.id;

              return (
                <div key={address.id} className="py-4 bg-white relative">
                  <div className="flex flex-col gap-4 text-sm">
                    <div className="flex justify-between items-center">
                      <label className="text-sm text-nowrap">Tên</label>
                      <Input
                        value={
                          isEditing
                            ? editedAddress.firstName || ""
                            : address.firstName
                        }
                        disabled={!isEditing}
                        onChange={(e) =>
                          isEditing &&
                          handleInputChange("firstName", e.target.value)
                        }
                        className={`w-[70%] rounded-none ${
                          isEditing ? "bg-white" : "bg-gray-100"
                        }`}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <label className="text-sm text-nowrap">
                        Họ & tên đệm
                      </label>
                      <Input
                        value={
                          isEditing
                            ? editedAddress.lastName || ""
                            : address.lastName
                        }
                        disabled={!isEditing}
                        onChange={(e) =>
                          isEditing &&
                          handleInputChange("lastName", e.target.value)
                        }
                        className={`w-[70%] rounded-none ${
                          isEditing ? "bg-white" : "bg-gray-100"
                        }`}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <label className="text-sm text-nowrap">Công ty</label>
                      <Input
                        value={
                          isEditing
                            ? editedAddress.company || ""
                            : address.company || ""
                        }
                        disabled={!isEditing}
                        onChange={(e) =>
                          isEditing &&
                          handleInputChange("company", e.target.value)
                        }
                        className={`w-[70%] rounded-none ${
                          isEditing ? "bg-white" : "bg-gray-100"
                        }`}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <label className="text-sm text-nowrap">Địa chỉ</label>
                      <Input
                        value={
                          isEditing
                            ? editedAddress.address || ""
                            : address.address
                        }
                        disabled={!isEditing}
                        onChange={(e) =>
                          isEditing &&
                          handleInputChange("address", e.target.value)
                        }
                        className={`w-[70%] rounded-none ${
                          isEditing ? "bg-white" : "bg-gray-100"
                        }`}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <label className="text-sm text-nowrap">Thành phố</label>
                      <Input
                        value={
                          isEditing ? editedAddress.city || "" : address.city
                        }
                        disabled={!isEditing}
                        onChange={(e) =>
                          isEditing && handleInputChange("city", e.target.value)
                        }
                        className={`w-[70%] rounded-none ${
                          isEditing ? "bg-white" : "bg-gray-100"
                        }`}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <label className="text-sm text-nowrap">Quốc gia</label>
                      <Input
                        value={
                          isEditing
                            ? editedAddress.country || ""
                            : address.country
                        }
                        disabled={!isEditing}
                        onChange={(e) =>
                          isEditing &&
                          handleInputChange("country", e.target.value)
                        }
                        className={`w-[70%] rounded-none ${
                          isEditing ? "bg-white" : "bg-gray-100"
                        }`}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <label className="text-sm text-nowrap">
                        Postal/Zip Code
                      </label>
                      <Input
                        value={
                          isEditing
                            ? editedAddress.zipCode || ""
                            : address.zipCode
                        }
                        disabled={!isEditing}
                        onChange={(e) =>
                          isEditing &&
                          handleInputChange("zipCode", e.target.value)
                        }
                        className={`w-[70%] rounded-none ${
                          isEditing ? "bg-white" : "bg-gray-100"
                        }`}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <label className="text-sm text-nowrap">Phone</label>
                      <Input
                        value={
                          isEditing ? editedAddress.phone || "" : address.phone
                        }
                        disabled={!isEditing}
                        onChange={(e) =>
                          isEditing &&
                          handleInputChange("phone", e.target.value)
                        }
                        className={`w-[70%] rounded-none ${
                          isEditing ? "bg-white" : "bg-gray-100"
                        }`}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={
                          isEditing
                            ? editedAddress.isDefault || false
                            : address.isDefault
                        }
                        disabled={!isEditing}
                        onCheckedChange={(checked) =>
                          isEditing && handleInputChange("isDefault", checked)
                        }
                        className="border-gray-500 size-3 rounded-none"
                      />
                      <label className="text-sm">
                        Đặt làm địa chỉ mặc định
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    {isEditing ? (
                      <>
                        <Button
                          onClick={() => handleUpdateAddress(address.id)}
                          disabled={loading}
                          className="bg-cyan-400 text-white hover:bg-cyan-500 rounded-none px-4 py-1 text-sm"
                        >
                          {loading ? "Đang cập nhật..." : "Cập nhật địa chỉ"}
                        </Button>
                        <Button
                          onClick={handleCancelEdit}
                          className="bg-black text-white hover:bg-gray-700 rounded-none px-4 py-1 text-sm"
                        >
                          Thoát
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={() => handleEditAddress(address)}
                          className="bg-cyan-400 text-white hover:bg-cyan-500 rounded-none px-4 py-1 text-sm"
                        >
                          Chỉnh sửa địa chỉ
                        </Button>
                        <Button
                          onClick={() => handleDeleteAddress(address.id)}
                          className="bg-black text-white hover:bg-gray-700 rounded-none px-4 py-1 text-sm"
                        >
                          Xóa
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}

            {addresses.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500 col-span-2">
                Bạn chưa có địa chỉ nào. Hãy thêm địa chỉ mới.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
