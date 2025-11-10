'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types/user.types';
import { addUser, updateUser } from '@/services/userApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, X } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
    user: User | null;
    onSave: () => void;
    onCancel: () => void;
}

export default function UserForm({ user, onSave, onCancel }: Props) {
    const INITIAL_FORM_STATE: Omit<User, 'id'> = {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        avatar: 'placeholder/avatar.png',
        role: 'customer',
        receiveNews: false,
        twoFactorEnabled: false
    };

    const [form, setForm] = useState<Omit<User, 'id'>>(user ? { ...user, password: '' } : INITIAL_FORM_STATE);
    const [errors, setErrors] = useState<Partial<Record<keyof Omit<User, 'id'>, string>>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = (currentForm: Omit<User, 'id'> = form): boolean => {
        const newErrors: Partial<Record<keyof Omit<User, 'id'>, string>> = {};

        if (!currentForm.firstName) newErrors.firstName = 'Vui lòng nhập tên';
        if (!currentForm.email) {
            newErrors.email = 'Vui lòng nhập email';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentForm.email)) {
            newErrors.email = 'Sai định dạng email';
        }
        if (!user && !currentForm.password) {
            newErrors.password = 'Vui lòng nhập mật khẩu';
        } else if (!user && currentForm.password && currentForm.password.length < 8) {
            newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
        } else if (!user && currentForm.password && !/[A-Z]/.test(currentForm.password)) {
            newErrors.password = 'Mật khẩu phải có ít nhất một chữ cái viết hoa';
        } else if (!user && currentForm.password && !/[a-z]/.test(currentForm.password)) {
            newErrors.password = 'Mật khẩu phải có ít nhất một chữ cái viết thường';
        } else if (!user && currentForm.password && !/[0-9]/.test(currentForm.password)) {
            newErrors.password = 'Mật khẩu phải có ít nhất một số';
        }
        if (!currentForm.lastName) newErrors.lastName = 'Vui lòng nhập họ';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => {
            const newForm = { ...prev, [name]: value };
            validateForm(newForm);
            return newForm;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const userData = { ...form, avatar: 'placeholder/avatar.png' };
            if (user) {
                await updateUser(user.id, userData);
                toast.success('Cập nhật người dùng thành công');
            } else {
                await addUser(userData);
                toast.success('Thêm người dùng thành công', {
                    description: `Người dùng ${userData.firstName} đã được tạo.`,
                });
            }
            setForm(INITIAL_FORM_STATE);
            onSave();
        } catch (error) {
            toast.error('Không thể lưu người dùng. Vui lòng thử lại.');
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (user) {
            setForm({ ...user, password: '', avatar: 'placeholder/avatar.png' });
            validateForm({ ...user, password: '', avatar: 'placeholder/avatar.png' });
        } else {
            setForm(INITIAL_FORM_STATE);
            validateForm(INITIAL_FORM_STATE);
        }
    }, [user]);

    return (
        <Card className="max-w-md mx-auto mt-8 mb-10 relative">
            <Button
                onClick={onCancel}
                variant="ghost"
                size="sm"
                className="absolute right-2 top-2 h-8 w-8 p-0"
            >
                <X className="h-4 w-4" />
            </Button>
            <CardHeader>
                <CardTitle className="text-center text-2xl">
                    {user ? 'Cập nhật người dùng' : 'Thêm người dùng'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">
                            Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className={errors.email ? 'border-red-500' : ''}
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">
                            Mật khẩu {user ? '(Để trống nếu không thay đổi)' : <span className="text-red-500">*</span>}
                        </Label>
                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={form.password}
                                onChange={handleChange}
                                className={errors.password ? 'border-red-500' : ''}
                                required={!user}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                        </div>
                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="firstName">Tên</Label>
                        <Input
                            id="firstName"
                            name="firstName"
                            value={form.firstName}
                            onChange={handleChange}
                            className={errors.firstName ? 'border-red-500' : ''}
                        />
                        {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="lastName">
                            Họ <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="lastName"
                            name="lastName"
                            value={form.lastName}
                            onChange={handleChange}
                            required
                            className={errors.lastName ? 'border-red-500' : ''}
                        />
                        {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role">Vai trò</Label>
                        <Select
                            value={form.role}
                            onValueChange={(value) => {
                                setForm((prev) => {
                                    const newForm = { ...prev, role: value as User['role'] };
                                    validateForm(newForm);
                                    return newForm;
                                });
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn vai trò" />
                            </SelectTrigger>
                            <SelectContent>
                                {[{ value: 'admin', label: 'Admin' }, { value: 'customer', label: 'Khách hàng' }].map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="receiveNews">Nhận tin tức</Label>
                        <Checkbox
                            id="receiveNews"
                            checked={form.receiveNews}
                            onCheckedChange={(checked) => {
                                setForm((prev) => {
                                    const newForm = { ...prev, receiveNews: !!checked };
                                    validateForm(newForm);
                                    return newForm;
                                });
                            }}
                        />
                    </div>

                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={onCancel}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-blue-500 hover:bg-blue-600"
                            disabled={isSubmitting || Object.keys(errors).length > 0}
                        >
                            {isSubmitting ? 'Đang lưu...' : user ? 'Cập nhật' : 'Thêm mới'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
