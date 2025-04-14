import { cleanEnv, str, port, num } from 'envalid';

/**
 * Configuration service that loads and validates environment variables
 */
class Config {
  public NODE_ENV: string;
  public PORT: number;
  public DB_HOST: string;
  public DB_PORT: number;
  public DB_USERNAME: string;
  public DB_PASSWORD: string;
  public DB_DATABASE: string;

  constructor() {
    try {
      const env = cleanEnv(process.env, {
        NODE_ENV: str({ choices: ['development', 'production'], default: 'development' }),
        PORT: port({ default: 3000 }),
        DB_HOST: str({ default: 'localhost' }),
        DB_PORT: num({ default: 5432 }),
        DB_USERNAME: str({ default: 'postgres' }),
        DB_PASSWORD: str({ default: 'postgres' }),
        DB_DATABASE: str({ default: 'dacrud-development' }),
      });

      this.NODE_ENV = env.NODE_ENV;
      this.PORT = env.PORT;
      this.DB_HOST = env.DB_HOST;
      this.DB_PORT = env.DB_PORT;
      this.DB_USERNAME = env.DB_USERNAME;
      this.DB_PASSWORD = env.DB_PASSWORD;
      this.DB_DATABASE = env.DB_DATABASE;
    } catch (error) {
      console.error('Environment validation error:', error);
      throw error;
    }
  }

  /**
   * Check if the app is running in production mode
   */
  public isProduction(): boolean {
    return this.NODE_ENV === 'production';
  }
}

export default new Config();
