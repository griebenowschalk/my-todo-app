import { db } from '@/db';
import { Todos } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

interface Params {
  params: {
    id: string;
  };
}

interface UpdateData {
  title?: string;
  description?: string;
  completed?: boolean;
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    await db.delete(Todos).where(eq(Todos.id, parseInt(id)));
    return NextResponse.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to delete todo' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const { title, description, completed } = await request.json();
    const updateData: UpdateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (completed !== undefined) updateData.completed = completed;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { message: 'No fields to update' },
        { status: 400 }
      );
    }

    const checkTodo = await db
      .select()
      .from(Todos)
      .where(eq(Todos.id, parseInt(id)));
    if (checkTodo.length === 0) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    const [updatedTodo] = await db
      .update(Todos)
      .set(updateData)
      .where(eq(Todos.id, parseInt(id)))
      .returning();
    return NextResponse.json(
      { message: 'Todo updated successfully', todo: updatedTodo },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to update todo' },
      { status: 500 }
    );
  }
}
