'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminDashboardSuite from '@/components/AdminDashboardSuite';
import { useStoredUser } from '@/lib/auth';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const user = useStoredUser();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;
    if (user?.role === 'farmer') {
      router.replace('/farmer');
    } else if (user?.role === 'customer') {
      router.replace('/orders');
    } else {
      queueMicrotask(() => { if (active) setChecking(false); });
    }
    return () => { active = false; };
  }, [router, user]);

  if (checking) {
    return (
      <div className="min-h-screen bg-[#112319] flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#E06D3B]" />
      </div>
    );
  }

  return <AdminDashboardSuite />;
}


