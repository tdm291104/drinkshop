import { useDataExport } from "@/hooks/useDataExport";
import { ExportButton } from "./ExportButton";

interface ExportDataProps {
    loading: boolean;
}

export const ExportData = ({ loading }: ExportDataProps) => {
    const { error, exportToExcel, exportToCSV, isConfigured } = useDataExport();

    return (
        <div className="flex flex-col space-y-2">
            <div className="flex space-x-4">
                <ExportButton
                    onClick={exportToExcel}
                    disabled={loading || !isConfigured}
                >
                    Export to Excel
                </ExportButton>
                <ExportButton
                    onClick={exportToCSV}
                    disabled={loading || !isConfigured}
                >
                    Export to CSV
                </ExportButton>
            </div>
            {error && (
                <div className="text-red-600 text-sm">
                    {error}
                </div>
            )}
        </div>
    );
};
