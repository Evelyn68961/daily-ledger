import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addEntry, deleteEntry, getEntries, updateEntry } from '../storage';

const ENTRIES_KEY = ['entries'];

export function useEntries() {
  return useQuery({
    queryKey: ENTRIES_KEY,
    queryFn: getEntries,
  });
}

export function useAddEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addEntry,
    onMutate: async (entry) => {
      await qc.cancelQueries({ queryKey: ENTRIES_KEY });
      const prev = qc.getQueryData(ENTRIES_KEY) ?? [];
      const optimistic = { ...entry, id: entry.id ?? `temp-${crypto.randomUUID()}` };
      qc.setQueryData(ENTRIES_KEY, [...prev, optimistic]);
      return { prev, optimisticId: optimistic.id };
    },
    onError: (_err, _entry, ctx) => {
      if (ctx?.prev) qc.setQueryData(ENTRIES_KEY, ctx.prev);
    },
    onSuccess: (saved, _entry, ctx) => {
      qc.setQueryData(ENTRIES_KEY, (cur = []) =>
        cur.map((e) => (e.id === ctx.optimisticId ? saved : e)),
      );
    },
  });
}

export function useUpdateEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }) => updateEntry(id, patch),
    onSuccess: (saved) => {
      qc.setQueryData(ENTRIES_KEY, (cur = []) =>
        cur.map((e) => (e.id === saved.id ? saved : e)),
      );
    },
  });
}

export function useDeleteEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteEntry,
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ENTRIES_KEY });
      const prev = qc.getQueryData(ENTRIES_KEY) ?? [];
      qc.setQueryData(ENTRIES_KEY, prev.filter((e) => e.id !== id));
      return { prev };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(ENTRIES_KEY, ctx.prev);
    },
  });
}

export function useReplaceAllEntries() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (entries) => {
      const cur = await getEntries();
      for (const e of cur) await deleteEntry(e.id);
      for (const e of entries) await addEntry(e);
      return getEntries();
    },
    onSuccess: (fresh) => {
      qc.setQueryData(ENTRIES_KEY, fresh);
    },
  });
}

export function useClearAllEntries() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const cur = await getEntries();
      for (const e of cur) await deleteEntry(e.id);
    },
    onSuccess: () => {
      qc.setQueryData(ENTRIES_KEY, []);
    },
  });
}
