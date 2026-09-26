'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminDashboardSuite from '@/components/AdminDashboardSuite';
import { getStoredUser } from '@/lib/auth';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const user = getStoredUser();
    if (user?.role === 'farmer') {
      router.replace('/farmer');
    }
  }, [router]);

  return <AdminDashboardSuite />;
}

