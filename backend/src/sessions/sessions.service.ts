import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from './session.entity';
import { Server } from '../servers/server.entity';
import { User } from '../users/user.entity';
import { WgEasyService } from '../integration/wg-easy.service';

@Injectable()
export class SessionsService {
    constructor(
        @InjectRepository(Session)
        private sessionRepository: Repository<Session>,
        @InjectRepository(Server)
        private serverRepository: Repository<Server>,
        private wgEasyService: WgEasyService,
    ) { }

    async createSession(user: User, serverId: string) {
        const server = await this.serverRepository.findOne({ where: { id: serverId } });
        if (!server) {
            throw new NotFoundException('Server not found');
        }

        // Deactivate previous active sessions for this user
        await this.sessionRepository.update(
            { userId: user.id, isActive: true },
            { isActive: false, endTime: new Date() }
        );

        // Create Client in wg-easy
        const wgConfig = {
            apiUrl: server.wgApiUrl || 'http://localhost:51821',
            password: server.wgApiPassword,
        };

        const clientName = `user-${user.id.substring(0, 8)}-${Date.now()}`;
        const wgClient = await this.wgEasyService.createClient(wgConfig, clientName);
        const config = await this.wgEasyService.getClientConfig(wgConfig, wgClient.id);

        const session = this.sessionRepository.create({
            user,
            server,
            virtualIp: wgClient.address,
            wgClientId: wgClient.id,
        });

        await this.sessionRepository.save(session);

        return {
            sessionId: session.id,
            config: config, // Return the full WireGuard configuration string
        };
    }

    async endSession(user: User, sessionId: string) {
        const session = await this.sessionRepository.findOne({
            where: { id: sessionId, userId: user.id },
            relations: ['server'],
        });

        if (!session) {
            throw new NotFoundException('Session not found');
        }

        session.isActive = false;
        session.endTime = new Date();

        // Simulate data usage (random 10MB - 500MB)
        session.bytesReceived = Math.floor(Math.random() * 500 * 1024 * 1024) + 10 * 1024 * 1024;
        session.bytesSent = Math.floor(Math.random() * 100 * 1024 * 1024) + 5 * 1024 * 1024;

        await this.sessionRepository.save(session);

        // Delete client from wg-easy to free up IP and resources
        if (session.wgClientId && session.server) {
            try {
                const wgConfig = {
                    apiUrl: session.server.wgApiUrl || 'http://localhost:51821',
                    password: session.server.wgApiPassword,
                };
                await this.wgEasyService.deleteClient(wgConfig, session.wgClientId);
            } catch (error) {
                // Log error but don't fail the disconnection flow
                console.error(`Failed to delete wg-easy client: ${error.message}`);
            }
        }

        return { success: true };
    }

    async getUserHistory(user: User) {
        return this.sessionRepository.find({
            where: { userId: user.id },
            relations: ['server'],
            order: { startTime: 'DESC' },
            take: 20,
        });
    }

    async getUserStats(user: User) {
        const sessions = await this.sessionRepository.find({
            where: { userId: user.id, isActive: false } // Only count finished sessions for simplicity for now
        });

        const totalConnections = sessions.length;
        const totalBytesReceived = sessions.reduce((sum, s) => sum + Number(s.bytesReceived), 0);
        const totalBytesSent = sessions.reduce((sum, s) => sum + Number(s.bytesSent), 0);

        // Calculate duration in minutes
        const totalDurationSeconds = sessions.reduce((sum, s) => {
            if (s.endTime && s.startTime) {
                return sum + (s.endTime.getTime() - s.startTime.getTime()) / 1000;
            }
            return sum;
        }, 0);

        return {
            totalConnections,
            totalBytes: totalBytesReceived + totalBytesSent,
            totalDuration: Math.floor(totalDurationSeconds / 60) // in minutes
        };
    }
}
