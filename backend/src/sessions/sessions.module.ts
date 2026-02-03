import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';
import { Session } from './session.entity';
import { Server } from '../servers/server.entity';
import { UsersModule } from '../users/users.module';
import { IntegrationModule } from '../integration/integration.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Session, Server]),
        UsersModule,
        IntegrationModule,
    ],
    controllers: [SessionsController],
    providers: [SessionsService],
})
export class SessionsModule { }
