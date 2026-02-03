import { Controller, Get, Patch, Param, Body, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { DeviceAuthGuard } from '../common/guards/device-auth.guard';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('me')
    @UseGuards(DeviceAuthGuard)
    getProfile(@Req() req: any): User {
        // The user is already attached to the request by DeviceAuthGuard
        return req.user;
    }

    @Get()
    async findAll() {
        return this.usersService.findAll();
    }

    @Get('stats/overview')
    async getStats() {
        return this.usersService.getStats();
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() body: Partial<User>) {
        return this.usersService.update(id, body);
    }
}
