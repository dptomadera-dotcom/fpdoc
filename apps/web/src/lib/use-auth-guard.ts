'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';

export function useAuthGuard(requiredRoles?: string[]) {
  const router = useRouter();

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      router.replace('/login');
      return;
    }
    if (requiredRoles && !requiredRoles.includes(user.role)) {
      router.replace('/dashboard');
    }
  }, [router]);
}
