import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): {
    status: string;
    version: string;
    message: string;
    timestamp: string;
  } {
    return {
      status: 'ok',
      version: process.env.npm_package_version ?? 'unknown',
      message: 'Server is running',
      timestamp: new Date().toISOString(),
    };
  }
}
