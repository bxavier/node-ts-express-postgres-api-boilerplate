import si from 'systeminformation';
import config from '@/utils/config';
import { AppDataSource } from '@/database/connection';

interface DatabaseStatus {
  name: string;
  host: string;
  state: number;
  status: string;
  responseTime?: number;
}

interface SystemHealth {
  status: string;
  message: string;
  timestamp: string;
  uptime: number;
  system: {
    cpu: {
      usage: number;
      cores: number;
    };
    memory: {
      total: number;
      free: number;
      used: number;
      usedPercent: number;
    };
    disk: {
      total: number;
      free: number;
      used: number;
      usedPercent: number;
    };
  };
  database: DatabaseStatus;
  framework: {
    name: string;
    version: string;
    nodeVersion: string;
  };
  application: {
    environment: string;
    version: string;
    build: string;
  };
}

class HealthService {
  /**
   * Check database connection status
   */
  private async getDatabaseStatus(): Promise<DatabaseStatus> {
    const dbState = [
      { value: 0, label: 'disconnected' },
      { value: 1, label: 'connected' },
      { value: 2, label: 'connecting' },
      { value: 3, label: 'disconnecting' },
    ];

    const isConnected = AppDataSource.isInitialized;
    const currentDbState = dbState.find((state) => state.value === (isConnected ? 1 : 0)) || dbState[0];

    const dbInfo: DatabaseStatus = {
      name: config.DB_DATABASE,
      host: `${config.DB_HOST}:${config.DB_PORT}`,
      state: currentDbState.value,
      status: currentDbState.label,
    };

    // If connected, measure response time with a simple query
    if (isConnected) {
      try {
        const start = Date.now();
        await AppDataSource.query('SELECT 1');
        const end = Date.now();
        dbInfo.responseTime = end - start;
      } catch (error) {
        // Ignore errors when checking response time
      }
    }

    return dbInfo;
  }

  /**
   * Get overall system health
   */
  public async getHealth(): Promise<SystemHealth> {
    // Execute all promises in parallel
    const [dbStatus, cpuLoad, cpuInfo, memInfo, diskInfo] = await Promise.all([
      this.getDatabaseStatus(),
      si.currentLoad(),
      si.cpu(),
      si.mem(),
      si.fsSize(),
    ]);

    const primaryDisk = diskInfo[0] || { size: 0, used: 0, available: 0 };

    // Overall health status
    const isHealthy = dbStatus.state === 1 && cpuLoad.currentLoad < 90 && memInfo.available > 1000000000;

    return {
      status: isHealthy ? 'healthy' : 'unhealthy',
      message: isHealthy ? 'System is healthy' : 'System health check detected issues',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      system: {
        cpu: {
          usage: parseFloat(cpuLoad.currentLoad.toFixed(2)),
          cores: cpuInfo.cores,
        },
        memory: {
          total: memInfo.total,
          free: memInfo.available,
          used: memInfo.used,
          usedPercent: parseFloat(((memInfo.used / memInfo.total) * 100).toFixed(2)),
        },
        disk: {
          total: primaryDisk.size,
          free: primaryDisk.available,
          used: primaryDisk.used,
          usedPercent: parseFloat(((primaryDisk.used / primaryDisk.size) * 100).toFixed(2)),
        },
      },
      database: dbStatus,
      framework: {
        name: 'Express',
        version: '5.1.0',
        nodeVersion: process.version,
      },
      application: {
        environment: process.env.NODE_ENV || 'unknown',
        version: process.env.npm_package_version || 'unknown',
        build: process.env.npm_package_build || 'unknown',
      },
    };
  }
}

export default HealthService;
