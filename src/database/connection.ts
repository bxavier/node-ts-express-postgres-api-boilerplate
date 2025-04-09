import { DataSource } from 'typeorm';
import config from '@/utils/config';
import logger from '@/utils/logger';

// Create TypeORM data source without synchronization
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.DB_HOST,
  port: config.DB_PORT,
  username: config.DB_USERNAME,
  password: config.DB_PASSWORD,
  database: config.DB_DATABASE,
  entities: [__dirname + '/../resources/**/*.entity{.ts,.js}'],
  synchronize: false,
  //logging: !config.isProduction(),
  ssl: config.isProduction() ? { rejectUnauthorized: false } : false,
});

/**
 * Initialize database connection
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    logger.info('Attempting PostgreSQL connection...');

    await AppDataSource.initialize();

    logger.info(`Connected to PostgreSQL database ${config.DB_DATABASE} successfully`);
  } catch (error: any) {
    logger.error(`Failed to connect to PostgreSQL: ${error.message}`);
  }
};

// Handle application termination
process.on('SIGINT', () => {
  if (AppDataSource.isInitialized) {
    AppDataSource.destroy().then(() => {
      logger.info('Database connection closed due to app termination');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});
