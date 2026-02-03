import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
    constructor(private readonly statsService: StatsService) { }

    @Get('dashboard')
    async getDashboardStats() {
        return this.statsService.getDashboardStats();
    }

    @Get('chart')
    async getTrafficChart() {
        return this.statsService.getTrafficChart();
    }
}
