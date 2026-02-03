import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Session } from '../sessions/session.entity';
import { Server, ServerStatus } from '../servers/server.entity';

@Injectable()
export class StatsService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Session)
        private sessionRepository: Repository<Session>,
        @InjectRepository(Server)
        private serverRepository: Repository<Server>,
    ) { }

    async getDashboardStats() {
        const totalUsers = await this.userRepository.count();
        const activeSessions = await this.sessionRepository.count({ where: { isActive: true } });
        const onlineServers = await this.serverRepository.count({ where: { status: ServerStatus.ONLINE } });
        const totalServers = await this.serverRepository.count();

        // Calculate total bandwidth (all time)
        const sessions = await this.sessionRepository.find();
        const totalBytes = sessions.reduce((sum, s) => sum + Number(s.bytesReceived) + Number(s.bytesSent), 0);

        // Convert to PB/TB/GB for display logic (handled in frontend, send raw bytes or string)
        // Let's send a formatted string for simplicity or raw bytes

        return {
            totalUsers,
            activeSessions,
            serversOnline: `${onlineServers}/${totalServers}`,
            totalBandwidthBytes: totalBytes
        };
    }

    async getTrafficChart() {
        // Mocking chart data for now as SQL grouping by date might be complex without custom query
        // In pending tasks we can make this real SQL aggregation
        // For now, return 7 days of "randomish" but consistent data or empty
        return [
            { name: 'Mon', uv: 4000, pv: 2400 },
            { name: 'Tue', uv: 3000, pv: 1398 },
            { name: 'Wed', uv: 2000, pv: 9800 },
            { name: 'Thu', uv: 2780, pv: 3908 },
            { name: 'Fri', uv: 1890, pv: 4800 },
            { name: 'Sat', uv: 2390, pv: 3800 },
            { name: 'Sun', uv: 3490, pv: 4300 },
        ];
    }
}
