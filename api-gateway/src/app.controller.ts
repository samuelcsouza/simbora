import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  async healthcheck(): Promise<any> {
    return {
      uptime: process.uptime(),
      message: 'OK',
      timestamp: Date.now(),
    };
  }
}
