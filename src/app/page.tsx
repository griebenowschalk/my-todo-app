'use client';
import { TodoList } from '@/components/TodoList';
import { Header } from '@/components/Header';
import { DemoBanner } from '@/components/DemoBanner';
import Container from '@/components/Container';
import { TodoProvider } from '@/contexts/TodoContext';

export default function Home() {
  return (
    <TodoProvider>
      <main className="flex flex-col justify-center h-full text-center gap-6 w-full mx-auto">
        <Header />

        <Container>
          <DemoBanner />
          <TodoList />
        </Container>
      </main>
    </TodoProvider>
  );
}
