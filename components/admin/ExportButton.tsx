import { Button } from "@/components/ui/button";

interface ExportButtonProps {
    onClick: () => void;
    disabled: boolean;
    children: React.ReactNode;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export const ExportButton = ({
    onClick,
    disabled,
    children,
    variant = "outline"
}: ExportButtonProps) => {
    return (
        <Button
            onClick={onClick}
            variant={variant}
            size="sm"
            disabled={disabled}
        >
            {children}
        </Button>
    );
};
