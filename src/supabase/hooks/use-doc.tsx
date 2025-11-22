'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../client';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export function useDoc<T = any>(table: string, id: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    // Cargar documento inicial
    const loadDoc = async () => {
      try {
        const { data: result, error: queryError } = await supabase
          .from(table)
          .select('*')
          .eq('id', id)
          .single();

        if (queryError) throw queryError;
        setData(result as T);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadDoc();

    // Suscribirse a cambios en tiempo real
    const channel = supabase
      .channel(`${table}-${id}`)
      .on(
        'postgres_changes' as any,
        {
          event: '*',
          schema: 'public',
          table: table,
          filter: `id=eq.${id}`,
        },
        (payload: RealtimePostgresChangesPayload<{ [key: string]: any }>) => {
          if (payload.eventType === 'UPDATE') {
            setData(payload.new as T);
          } else if (payload.eventType === 'DELETE') {
            setData(null);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, id]);

  return { data, loading, error };
}
