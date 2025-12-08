'use client';
import { useRouter } from 'next/navigation';
import { getToken, logoutUser } from '@/lib/auth';
import { Button } from '@/components/ui/button';

export default function DashboardLayout({ children }: { 
    children: React.ReactNode; 
}) {

    const router = useRouter();
    const token = getToken();

    if (!token) {
        router.push('/login');
        return null;
    }

    function handleLogout() {
        logoutUser();
        router.push('/login');
    }

    return (
        <div className="p-6">
                {children}
        </div>
    );
}