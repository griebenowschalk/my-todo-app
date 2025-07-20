import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Todo } from '@/types/todo';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from './ui/dialog';
import { useEffect } from 'react';
import { useTodoContext } from '@/contexts/TodoContext';

interface TodoFormProps {
  open: boolean;
  onClose: () => void;
  todo: Todo | null;
}

const formSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
});

export const TodoForm = ({ onClose, todo, open }: TodoFormProps) => {
  const { createTodo, updateTodo, loading } = useTodoContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  useEffect(() => {
    form.reset({
      title: todo?.title || '',
      description: todo?.description || '',
    });
  }, [todo, form]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const result = todo
      ? await updateTodo(todo.id.toString(), data)
      : await createTodo(data);
    if (result.success) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose} modal>
      <DialogContent
        className="max-w-md"
        aria-describedby="todo-form"
        onOpenAutoFocus={(e) => e.preventDefault()} // Prevent auto-focus
      >
        <div className="flex flex-col gap-1">
          <DialogTitle className="text-2xl font-bold">
            {todo ? 'Edit Todo' : 'Add Todo'}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            {todo ? 'Edit the todo' : 'Add a new todo'}
          </DialogDescription>
        </div>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Label htmlFor="title">Title</Label>
          <Input
            disabled={loading}
            autoFocus={false}
            {...form.register('title')}
          />
          <Label htmlFor="description">Description</Label>
          <Textarea
            disabled={loading}
            autoFocus={false}
            {...form.register('description')}
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Submit'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
