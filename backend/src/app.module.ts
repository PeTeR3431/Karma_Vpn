import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { ServersModule } from './servers/servers.module';
import { Server } from './servers/server.entity';
import { SessionsModule } from './sessions/sessions.module';
import { Session } from './sessions/session.entity';
import { SpeedTestModule } from './speedtest/speedtest.module';
import { StatsModule } from './stats/stats.module';
import { ConfigModule } from '@nestjs/config';
import { IntegrationModule } from './integration/integration.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'karma_user',
      password: 'karma_password',
      database: 'karma_vpn',
      entities: [User, Server, Session],
      synchronize: true, // Auto create tables (dev only)
    }),
    UsersModule,
    ServersModule,
    SessionsModule,
    SpeedTestModule,
    StatsModule,
    IntegrationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
