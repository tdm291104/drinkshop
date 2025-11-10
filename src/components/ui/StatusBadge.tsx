import React from 'react';

export type StatusType = 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled';

interface StatusBadgeProps {
    status: StatusType | string;
    className?: string;
}

const StatusBadge = ({ status, className = '' }: StatusBadgeProps) => {
    const getStatusStyle = (status: string) => {
        if (!status) return 'bg-gray-100 text-gray-800';

        switch (status.toLowerCase()) {
            case 'active':
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'inactive':
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'pending':
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(status)} ${className}`}>
            {status || 'N/A'}
        </span>
    );
};

export default StatusBadge;