"use client";

import { FormLabel as Label } from "@/components/ui/form";
import { cn } from "@/lib/utils";

interface FormLabelProps extends React.ComponentProps<typeof Label> {
  required?: boolean;
}

export function FormLabel({
  required,
  className,
  children,
  ...props
}: FormLabelProps) {
  return (
    <Label className={cn("flex gap-1 items-center", className)} {...props}>
      {children}
      {required && <span className="text-red-500">*</span>}
    </Label>
  );
}
