import React from 'react';
import { AdminSidebar } from './MenuLayout';
import { Toaster } from 'sonner';

interface AdminPageLayoutProps {
    children: React.ReactNode;
}

const AdminPageLayout = ({ children }: AdminPageLayoutProps) => (
    <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <div className="flex-1 md:ml-64 p-6">
            <Toaster position="top-right" richColors />
            {children}
        </div>
    </div>
);

export default AdminPageLayout;
