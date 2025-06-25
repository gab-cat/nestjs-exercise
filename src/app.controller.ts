import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/health')
  @ApiOperation({ summary: 'Get health status' })
  @ApiResponse({
    status: 200,
    description: 'Returns the health status of the server',
  })
  getHello(): {
    status: string;
    version: string;
    message: string;
    timestamp: string;
  } {
    return this.appService.getHello();
  }
}
