'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../client';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

type UseCollectionOptions = {
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
  filters?: Array<{ column: string; operator: string; value: any }>;
};

export function useCollection<T = any>(
  table: string,
  options: UseCollectionOptions | null = {}
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Función para forzar recarga manual
  const refresh = () => setRefreshKey(prev => prev + 1);

  useEffect(() => {
    // Si options es null, no cargar datos
    if (options === null) {
      setData([]);
      setLoading(false);
      return;
    }

    // Validar que todos los valores de filtro tengan valores válidos
    if (options.filters) {
      const hasInvalidFilter = options.filters.some(({ value }) => {
        return value === null || value === undefined || value === '';
      });
      
      if (hasInvalidFilter) {
        setData([]);
        setLoading(false);
        return;
      }
    }

    let query = supabase.from(table).select('*');

    // Aplicar filtros
    if (options.filters) {
      options.filters.forEach(({ column, operator, value }) => {
        switch (operator) {
          case '==':
            query = query.eq(column, value);
            break;
          case '!=':
            query = query.neq(column, value);
            break;
          case '>':
            query = query.gt(column, value);
            break;
          case '>=':
            query = query.gte(column, value);
            break;
          case '<':
            query = query.lt(column, value);
            break;
          case '<=':
            query = query.lte(column, value);
            break;
          case 'in':
            query = query.in(column, value);
            break;
          case 'contains':
            query = query.contains(column, value);
            break;
        }
      });
    }

    // Aplicar ordenamiento
    if (options.orderBy) {
      query = query.order(options.orderBy.column, {
        ascending: options.orderBy.ascending ?? true,
      });
    }

    // Aplicar límite
    if (options.limit) {
      query = query.limit(options.limit);
    }

    // Cargar datos iniciales
    const loadData = async () => {
      try {
        const { data: results, error: queryError } = await query;
        if (queryError) throw queryError;
        setData((results as T[]) || []);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Suscribirse a cambios en tiempo real
    const channel = supabase
      .channel(`${table}-changes`)
      .on(
        'postgres_changes' as any,
        {
          event: '*',
          schema: 'public',
          table: table,
        },
        (payload: RealtimePostgresChangesPayload<{ [key: string]: any }>) => {
          if (payload.eventType === 'INSERT') {
            setData((current) => [...current, payload.new as T]);
          } else if (payload.eventType === 'UPDATE') {
            setData((current) =>
              current.map((item: any) =>
                item.id === (payload.new as any).id ? (payload.new as T) : item
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setData((current) =>
              current.filter((item: any) => item.id !== (payload.old as any).id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, JSON.stringify(options), refreshKey]);

  return { data, loading, error, refresh };
}
