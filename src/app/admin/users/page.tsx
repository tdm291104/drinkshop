'use client';

import { useState, useRef } from 'react';
import { User } from '@/types/user.types';
import UserTable from '@/components/admin/UserTable';
import UserForm from '@/components/admin/UserForm';
import { Button } from '@/components/ui/button';
import { AdminSidebar } from '@/components/layout/MenuLayout';

export default function AdminUserPage() {
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [showForm, setShowForm] = useState(false);
    const userTableRef = useRef<{ reloadUsers: () => void }>(null);

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setShowForm(true);
    };

    const handleAddNew = () => {
        if (showForm && !editingUser) {
            setShowForm(false);
        } else {
            setEditingUser(null);
            setShowForm(true);
        }
    };

    const handleFormSave = () => {
        setShowForm(false);
        setEditingUser(null);
        userTableRef.current?.reloadUsers();
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setEditingUser(null);
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <AdminSidebar />

            <div className="flex-1 md:ml-64 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-semibold">User Management</h1>
                        <Button
                            onClick={handleAddNew}
                            className={`${showForm && !editingUser
                                ? 'bg-gray-500 hover:bg-gray-600'
                                : 'bg-blue-500 hover:bg-blue-600'}`}
                        >
                            {showForm && !editingUser ? 'Cancel' : 'Add New User'}
                        </Button>
                    </div>
                    {showForm && (
                        <UserForm
                            user={editingUser}
                            onSave={handleFormSave}
                            onCancel={handleFormCancel}
                        />
                    )}
                    <UserTable
                        ref={userTableRef}
                        onEdit={handleEdit}
                    />
                </div>
            </div>
        </div>
    );
}
