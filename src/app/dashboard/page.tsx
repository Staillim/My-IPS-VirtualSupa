"use client";

import { useSupabase, supabase } from "@/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import PatientDashboard from "@/components/dashboards/patient-dashboard";

export default function DashboardPage() {
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
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (userData) {
      if (userData.role === 'ADMIN') {
        router.push('/dashboard/admin');
      } else if (userData.role !== 'PACIENTE') {
        router.push('/dashboard/personal');
      }
    }
  }, [userData, router]);

  if (loading || isUserDataLoading) {
    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
            <Skeleton className="h-8 w-1/2 mb-2" />
            <Skeleton className="h-4 w-3/4 mb-8" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
             <div>
                <Skeleton className="h-8 w-1/4 mb-4" />
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                </div>
            </div>
        </div>
    );
  }

  if (userData?.role === 'PACIENTE') {
    return <PatientDashboard />;
  }

  return null; 
}
