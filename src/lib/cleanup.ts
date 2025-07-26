import { db } from '@/db';
import { Todos } from '@/db/schema';
import { lt, count, or, like, notInArray, desc } from 'drizzle-orm';
import { BLOCKED_WORDS } from './middleware';

export class DatabaseCleanup {
  private static readonly MAX_TODOS = 100;
  private static readonly DAYS_TO_KEEP = 7;

  static async removeOldTodos(): Promise<{ deleted: number }> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.DAYS_TO_KEEP);

      const result = await db
        .delete(Todos)
        .where(lt(Todos.createdAt, cutoffDate));

      console.log(`Cleaned up todos older than ${this.DAYS_TO_KEEP} days`);
      return { deleted: result.rowCount || 0 };
    } catch (error) {
      console.error('Error cleaning up old todos:', error);
      throw error;
    }
  }

  static async limitTotalTodos(): Promise<{ deleted: number }> {
    try {
      const [{ totalCount }] = await db
        .select({ totalCount: count() })
        .from(Todos);

      if (totalCount <= this.MAX_TODOS) {
        return { deleted: 0 };
      }

      const todosToKeep = await db
        .select({ id: Todos.id })
        .from(Todos)
        .orderBy(desc(Todos.createdAt))
        .limit(this.MAX_TODOS);

      if (todosToKeep.length === 0) {
        return { deleted: 0 };
      }

      const idsToKeep = todosToKeep.map((todo) => todo.id);

      const result = await db
        .delete(Todos)
        .where(notInArray(Todos.id, idsToKeep));

      console.log(
        `Limited total todos to ${this.MAX_TODOS}, deleted ${result.rowCount || 0}`
      );
      return { deleted: result.rowCount || 0 };
    } catch (error) {
      console.error('Error limiting total todos:', error);
      throw error;
    }
  }

  static async removeInappropriateTodos(): Promise<{ deleted: number }> {
    try {
      let totalDeleted = 0;

      for (const word of BLOCKED_WORDS) {
        const result = await db
          .delete(Todos)
          .where(
            or(
              like(Todos.title, `%${word}%`),
              like(Todos.description, `%${word}%`)
            )
          );

        totalDeleted += result.rowCount || 0;
      }

      if (totalDeleted > 0) {
        console.log(`Removed ${totalDeleted} inappropriate todos`);
      }

      return { deleted: totalDeleted };
    } catch (error) {
      console.error('Error removing inappropriate todos:', error);
      throw error;
    }
  }

  static async runFullCleanup(): Promise<{
    oldTodosDeleted: number;
    excessTodosDeleted: number;
    inappropriateDeleted: number;
  }> {
    console.log('Starting database cleanup...');

    const [oldResult, limitResult, inappropriateResult] = await Promise.all([
      this.removeOldTodos(),
      this.limitTotalTodos(),
      this.removeInappropriateTodos(),
    ]);

    console.log('Database cleanup completed');

    return {
      oldTodosDeleted: oldResult.deleted,
      excessTodosDeleted: limitResult.deleted,
      inappropriateDeleted: inappropriateResult.deleted,
    };
  }
}
