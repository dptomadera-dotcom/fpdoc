'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';

export function useAuthGuard(requiredRoles?: string[]) {
  const router = useRouter();

  useEffect(() => {
    const user = authService.getCurrentUser() ?? useAuthStore.getState().user;
    if (!user) {
      router.replace('/login');
      return;
    }
    if (requiredRoles && !requiredRoles.includes(user.role)) {
      router.replace('/dashboard');
    }
  }, [router]);
}
