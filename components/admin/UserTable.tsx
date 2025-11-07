'use client';

import { useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { User } from '@/types/user.types';
import { getUsers, deleteUser } from '@/services/userApi';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogFooter,
} from '../ui/alert-dialog';
import { toast, Toaster } from 'sonner';
import { Loader2 } from 'lucide-react';

interface Column {
    key: keyof User | 'actions';
    label: string;
    render?: (user: User) => React.ReactNode;
}

interface Props {
    onEdit: (user: User) => void;
}

export interface UserTableRef {
    reloadUsers: () => void;
}

const UserTable = forwardRef<UserTableRef, Props>(({ onEdit }, ref) => {
    const [users, setUsers] = useState<User[]>([]);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getUsers();
            setUsers(data);
            setError(null);
        } catch {
            setError('Failed to load users. Please try again.');
            toast.error('Failed to load users');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useImperativeHandle(ref, () => ({
        reloadUsers: loadUsers
    }), [loadUsers]);

    const handleDeleteClick = (user: User) => {
        setUserToDelete(user);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (userToDelete) {
            try {
                await deleteUser(userToDelete.id);
                toast.success(`User ${userToDelete.firstName} deleted successfully`);
                await loadUsers();
            } catch {
                toast.error('Failed to delete user. Please try again.');
            } finally {
                setDeleteModalOpen(false);
                setUserToDelete(null);
            }
        }
    };

    const handleDeleteCancel = () => {
        setDeleteModalOpen(false);
        setUserToDelete(null);
    };

    const columns: Column[] = [
        { key: 'id', label: 'ID' },
        { key: 'firstName', label: 'First Name' },
        { key: 'lastName', label: 'Last Name' },
        { key: 'email', label: 'Email' },
        { key: 'role', label: 'Role' },
        {
            key: 'receiveNews',
            label: 'Receive News',
            render: (user: User) => (user.receiveNews ? 'Yes' : 'No'),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (user: User) => (
                <div className="flex gap-2">
                    <Button
                        onClick={() => onEdit(user)}
                        variant="outline"
                        size="sm"
                        className="text-blue-600 hover:text-blue-800"
                    >
                        Edit
                    </Button>
                    <Button
                        onClick={() => handleDeleteClick(user)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-800"
                    >
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    return (
        <>
            <Toaster position="top-right" richColors />
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : error ? (
                <div className="text-red-500 text-center">{error}</div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((column) => (
                                <TableHead key={column.key}>{column.label}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center">
                                    No users found
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user.id}>
                                    {columns.map((column) => (
                                        <TableCell key={String(column.key)}>
                                            {column.render ? column.render(user) : (user[column.key as keyof User] as React.ReactNode)}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            )}

            <AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Delete User</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete user <strong>{String(userToDelete?.firstName ?? '')}</strong>? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleDeleteCancel}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
});

UserTable.displayName = 'UserTable';

export default UserTable;
