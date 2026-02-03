import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { DeviceAuthGuard } from '../common/guards/device-auth.guard';

@Controller('sessions')
@UseGuards(DeviceAuthGuard)
export class SessionsController {
    constructor(private readonly sessionsService: SessionsService) { }

    @Post('connect')
    async connect(@Req() req: any, @Body('serverId') serverId: string) {
        return this.sessionsService.createSession(req.user, serverId);
    }

    @Post('disconnect')
    async disconnect(@Req() req: any, @Body('sessionId') sessionId: string) {
        return this.sessionsService.endSession(req.user, sessionId);
    }

    @Get('history')
    async getHistory(@Req() req: any) {
        return this.sessionsService.getUserHistory(req.user);
    }

    @Get('stats')
    async getStats(@Req() req: any) {
        return this.sessionsService.getUserStats(req.user);
    }
}
