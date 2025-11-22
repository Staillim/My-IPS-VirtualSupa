'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase, supabase } from '@/supabase';
import { Skeleton } from '@/components/ui/skeleton';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('PACIENTE' | 'PERSONAL' | 'ADMIN')[];
  requireAuth?: boolean;
}

export function ProtectedRoute({ 
  children, 
  allowedRoles, 
  requireAuth = true 
}: ProtectedRouteProps) {
  const { user, loading } = useSupabase();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [isUserDataLoading, setIsUserDataLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      if (!user) {
        setIsUserDataLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsUserDataLoading(false);
      }
    }

    fetchUserData();
  }, [user]);

  useEffect(() => {
    // Si no está cargando y no hay usuario, redirigir al login
    if (!loading && !user && requireAuth) {
      router.push('/login');
    }
  }, [user, loading, requireAuth, router]);

  useEffect(() => {
    // Si se cargó el usuario y hay roles permitidos, verificar
    if (userData && allowedRoles && allowedRoles.length > 0) {
      if (!allowedRoles.includes(userData.role)) {
        // Redirigir según el rol
        if (userData.role === 'ADMIN') {
          router.push('/dashboard/admin');
        } else if (userData.role === 'PERSONAL') {
          router.push('/dashboard/personal');
        } else {
          router.push('/dashboard');
        }
      }
    }
  }, [userData, allowedRoles, router]);

  // Mostrar loading mientras se verifica la autenticación
  if (loading || isUserDataLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <Skeleton className="h-12 w-12 rounded-full mx-auto" />
          <Skeleton className="h-4 w-48 mx-auto" />
        </div>
      </div>
    );
  }

  // Si requiere auth y no hay usuario, no mostrar nada (está redirigiendo)
  if (requireAuth && !user) {
    return null;
  }

  // Si hay roles permitidos y el usuario no tiene el rol correcto, no mostrar nada
  if (userData && allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(userData.role)) {
    return null;
  }

  // Todo OK, mostrar el contenido
  return <>{children}</>;
}
