import { db } from '@/db';
import { Todos } from '@/db/schema';
import { NextResponse } from 'next/server';
import {
  validateTodoInput,
  checkRateLimit,
  getClientIP,
  createRateLimitResponse,
} from '@/lib/middleware';

export async function GET(request: Request) {
  const clientIP = getClientIP(request);

  if (!checkRateLimit(clientIP)) {
    return createRateLimitResponse();
  }

  try {
    const todos = await db.select().from(Todos).limit(100);
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
  const clientIP = getClientIP(request);

  if (!checkRateLimit(clientIP)) {
    return createRateLimitResponse();
  }

  try {
    const data = await request.json();

    const validation = validateTodoInput(data);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.errors },
        { status: 400 }
      );
    }

    const { title, description } = data;

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
