'use client';

import { useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createNote, deleteNote, fetchNotes } from '@/lib/api';
import type { CreateNotePayload } from '@/components/NoteForm/NoteForm';

import NoteList from '@/components/NoteList/NoteList';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';

import css from './NotesPage.module.css';

export default function NotesClient() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState<number>(1);
  const perPage = 10;

  const [search, setSearch] = useState<string>('');
  const [debouncedSearch] = useDebounce(search, 500);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const queryKey = useMemo(
    () => ['notes', { page, perPage, search: debouncedSearch }],
    [page, perPage, debouncedSearch]
  );

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey,
    queryFn: () => fetchNotes({ page, perPage, search: debouncedSearch }),
    placeholderData: keepPreviousData,
  });

  const { mutate: removeNote, isPending: isDeleting } = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const { mutate: addNote, isPending: isCreating } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setIsModalOpen(false);
    },
  });

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleCreate = (values: CreateNotePayload) => {
    addNote(values);
  };

  if (isLoading) return <p>Loading, please wait...</p>;
  if (error || !data) return <p>Something went wrong.</p>;

  return (
    <main className={css.app}>
      <div className={css.toolbar}>
        <button type="button" className={css.button} onClick={openModal}>
          Add note
        </button>

        <SearchBox value={search} onChange={handleSearchChange} />
      </div>

      {isFetching && <p>Updating...</p>}

      <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />

      <NoteList notes={data.notes} onDelete={removeNote} isDeleting={isDeleting} />

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onCancel={closeModal} onSubmit={handleCreate} />
          {isCreating && <p>Creating...</p>}
        </Modal>
      )}
    </main>
  );
}
