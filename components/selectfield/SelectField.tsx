"use client";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { formatCurrency } from "@/utils/format.currency";
type Option = {
  label: string;
  value: string;
  fee?: number; // Optional: dùng khi muốn dòng phụ phía dưới value
};

interface SelectFieldProps {
  label: string;
  placeholder: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
}

export default function SelectField({
  label,
  placeholder,
  options,
  value,
  onChange,
}: SelectFieldProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{label}</SelectLabel>
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                <div className="flex flex-row justify-between items-center gap-4">
                  <span>{opt.label}</span>
                  {opt.fee && (
                    <span className="text-xs text-muted-foreground">
                      {formatCurrency(opt.fee)}
                    </span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
