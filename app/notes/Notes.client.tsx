'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import NoteList from '@/components/NoteList/NoteList';

export default function NotesClient() {
  const page = 1;
  const perPage = 10;
  const search = '';

  const { data, isLoading, error } = useQuery({
    queryKey: ['notes', { page, perPage, search }],
    queryFn: () => fetchNotes({ page, perPage, search }),
  });

  if (isLoading) {
    return <p>Loading, please wait...</p>;
  }

  if (error || !data) {
    return <p>Something went wrong.</p>;
  }

  return (
    <main>
      <NoteList notes={data.notes} />
    </main>
  );
}
