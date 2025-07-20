'use client';

import { Todo } from '@/types/todo';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { useState } from 'react';
import { Badge } from './ui/badge';
import { TodoForm } from './TodoForm';
import { useTodoContext } from '@/contexts/TodoContext';

export const TodoList = () => {
  const [showForm, setShowForm] = useState(false);
  const [editTodo, setEditTodo] = useState<Todo | null>(null);
  const { deleteTodo, updateTodo, todos: todoList } = useTodoContext();

  console.log('todoList', todoList);

  return (
    <div className="flex flex-col gap-4 p-6 pt-0">
      <div className="flex justify-between items-center gap-4 h-16">
        <div>
          <h3 className="text-2xl font-bold">Todo List</h3>
        </div>
        <div>
          <Button onClick={() => setShowForm(true)}>Add Todo</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {todoList.map((todo) => (
          <Card
            className="cursor-pointer hover:border-gray-400"
            key={todo.id}
            onClick={(e) => {
              setShowForm(true);
              setEditTodo(todo);
            }}
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex flex-row items-center gap-3">
                <CardTitle className="text-lg font-medium max-w-[200px] truncate">
                  {todo.title}
                </CardTitle>
                <CardDescription>
                  <Badge
                    className={`${
                      todo.completed
                        ? 'bg-green-500 text-white'
                        : 'bg-yellow-500 text-white'
                    }`}
                    variant="outline"
                  >
                    {todo.completed ? 'Completed' : 'Pending'}
                  </Badge>
                </CardDescription>
              </div>
              <Checkbox
                className="w-4 h-4 border-gray-300 hover:border-gray-400 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  updateTodo(todo.id.toString(), {
                    completed: !todo.completed,
                  });
                }}
                checked={todo.completed}
              />
            </CardHeader>
            <CardContent>
              <p>{todo.description}</p>
            </CardContent>
            <CardFooter>
              <Button
                className="cursor-pointer bg-red-500 hover:bg-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  deleteTodo(todo.id.toString());
                }}
              >
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <TodoForm
        open={showForm}
        onClose={() => {
          setShowForm(false);
          setEditTodo(null);
        }}
        todo={editTodo}
      />
    </div>
  );
};
