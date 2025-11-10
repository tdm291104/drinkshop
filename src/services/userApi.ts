import { User } from '../types/user.types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE as string;
export const getUsers = async (): Promise<User[]> => {
    const response = await fetch(`${API_BASE}/users`);
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
};

export const addUser = async (user: Omit<User, 'id'>): Promise<void> => {
    const userData = { ...user, avatar: 'placeholder/avatar.png' };
    const response = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Failed to add user');
};

export const updateUser = async (id: string, user: Partial<User>): Promise<void> => {
    const userData = { ...user, avatar: 'placeholder/avatar.png' };
    const response = await fetch(`${API_BASE}/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Failed to update user');
};

export const deleteUser = async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/users/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete user');
};