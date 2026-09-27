'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminDashboardSuite from '@/components/AdminDashboardSuite';
import { getStoredUser } from '@/lib/auth';
import type { User } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const currentUser = getStoredUser();
    setUser(currentUser);
    
    if (currentUser?.role === 'farmer') {
      router.replace('/farmer');
    } else if (currentUser?.role === 'customer') {
      router.replace('/orders');
    } else {
      setChecking(false);
    }
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen bg-[#112319] flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#E06D3B]" />
      </div>
    );
  }

  return <AdminDashboardSuite />;
}


