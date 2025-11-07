import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Address } from "@/types/user.types";
import { useState } from "react";

interface ModalAddressProps {
  addresses: Address[];
  selectedAddress: Address | null;
  onClose: () => void;
  onSelect: (address: Address) => void;
}

const ModalAddress = ({
  addresses,
  selectedAddress,
  onClose,
  onSelect,
}: ModalAddressProps) => {
  const [selectedId, setSelectedId] = useState(selectedAddress?.id || "");

  const handleConfirm = () => {
    const newAddress = addresses.find((addr) => addr.id === selectedId);
    if (newAddress) {
      onSelect(newAddress);
      onClose();
    }
  };

  return (
    <DialogContent>
      <DialogTitle>Chọn địa chỉ giao hàng</DialogTitle>
      <div className="grid gap-6 overflow-y-auto max-h-[60vh] pr-2">
        <RadioGroup
          value={selectedId}
          onValueChange={(value) => setSelectedId(value)}
          className="space-y-3 mt-4"
        >
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="flex items-start gap-2 border rounded-md p-3"
            >
              <RadioGroupItem value={addr.id} id={addr.id} />
              <Label htmlFor={addr.id} className="cursor-pointer ">
                <span className="flex flex-col gap-1">
                  <span className="text-sm text-gray-600">
                    {addr.address}, {addr.city}, {addr.country}
                  </span>
                  <span className="text-sm text-gray-600">
                    SĐT: {addr.phone}
                  </span>
                </span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Hủy
        </Button>
        <Button
          className="bg-black hover:bg-gray-800"
          onClick={handleConfirm}
          disabled={!selectedId}
        >
          Xác nhận
        </Button>
      </div>
    </DialogContent>
  );
};

export default ModalAddress;
