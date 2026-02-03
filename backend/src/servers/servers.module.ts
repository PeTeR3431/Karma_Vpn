import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServersController } from './servers.controller';
import { ServersService } from './servers.service';
import { Server } from './server.entity';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Server]),
        UsersModule, // Import UsersModule because DeviceAuthGuard needs UsersService
    ],
    controllers: [ServersController],
    providers: [ServersService],
})
export class ServersModule { }
