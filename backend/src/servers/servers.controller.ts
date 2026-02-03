import { Controller, Get, Post, Put, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ServersService } from './servers.service';
import { DeviceAuthGuard } from '../common/guards/device-auth.guard';
import { Server } from './server.entity';

@Controller('servers')
@UseGuards(DeviceAuthGuard) // Protect all endpoints in this controller
export class ServersController {
    constructor(private readonly serversService: ServersService) { }

    @Get()
    async findAll(): Promise<Server[]> {
        return this.serversService.findAll();
    }

    // Temporary Admin Endpoint to add servers
    @Post()
    async create(@Body() body: Partial<Server>): Promise<Server> {
        return this.serversService.create(body);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() body: Partial<Server>): Promise<Server> {
        return this.serversService.update(id, body);
    }

    @Patch(':id/status')
    async toggleStatus(@Param('id') id: string): Promise<Server> {
        return this.serversService.toggleStatus(id);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        return this.serversService.delete(id);
    }
}
