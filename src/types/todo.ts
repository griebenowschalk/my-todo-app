export type Todo = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type TodoForm = {
  title?: string;
  description?: string;
  completed?: boolean;
};
