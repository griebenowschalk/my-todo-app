'use client';
import { TodoList } from '@/components/TodoList';
import { Header } from '@/components/Header';

export default function Home() {
  return (
    <main className="flex flex-col justify-center h-full text-center gap-6 w-full mx-auto">
      <Header />
      <TodoList />
    </main>
  );
}
