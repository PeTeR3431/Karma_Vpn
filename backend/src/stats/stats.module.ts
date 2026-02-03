import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { User } from '../users/user.entity';
import { Session } from '../sessions/session.entity';
import { Server } from '../servers/server.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Session, Server]),
    ],
    controllers: [StatsController],
    providers: [StatsService],
})
export class StatsModule { }
