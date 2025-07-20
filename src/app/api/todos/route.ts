import { db } from '@/db';
import { Todos } from '@/db/schema';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const todos = await db.select().from(Todos);
    return NextResponse.json(todos);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch todos' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { title, description } = await request.json();

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const [todo] = await db
      .insert(Todos)
      .values({ title, description })
      .returning();

    return NextResponse.json(
      {
        message: 'Todo created successfully',
        todo,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to create todo' },
      { status: 500 }
    );
  }
}
