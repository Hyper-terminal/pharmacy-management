import knex from 'knex';
import betterSqlite3, { Database as DatabaseInstance } from 'better-sqlite3';

/**
 * DatabaseService class manages the SQLite connection using better-sqlite3
 * and integrates Knex.js for building and executing queries.
 */
class DatabaseService {
  private static instance: DatabaseService;
  private knex: any;
  private readonly db: DatabaseInstance;

  private constructor(databasePath: string) {
    // Initialize better-sqlite3 for low-level database management
    this.db = new betterSqlite3(databasePath, { verbose: console.log });

    // Initialize Knex.js with SQLite3 client
    this.knex = knex({
      client: 'better-sqlite3',
      connection: {
        filename: databasePath,
      },
      useNullAsDefault: true,
    });

  }

  /**
   * Singleton pattern to ensure a single database connection throughout the app.
   */
  public static getInstance(databasePath: string = './pharmacy.db'): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService(databasePath);
    }
    return DatabaseService.instance;
  }

  /**
   * Provides direct access to the database instance via Knex.js.
   * This is useful for complex queries and migrations.
   */
  public getKnexConnection(): any {
    return this.knex;
  }

  /**
   * Provides access to the low-level better-sqlite3 instance for direct operations.
   * You can use this for simpler and more efficient operations that Knex can't easily handle.
   */
  public getConnection(): DatabaseInstance {
    return this.db;
  }

  /**
   * Safely closes the database connection.
   */
  public close(): void {
    try {
      this.db.close();
      this.knex.destroy(); // Properly closes the Knex connection pool.
      console.info('Database connection closed');
    } catch (error) {
      console.error('Error closing database connection:', error);
    }
  }
}

// Export a singleton instance for global use
const dbService = DatabaseService.getInstance();
export default dbService;
