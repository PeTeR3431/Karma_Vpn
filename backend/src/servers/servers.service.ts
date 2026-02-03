import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Server, ServerStatus } from './server.entity';

@Injectable()
export class ServersService implements OnModuleInit {
    constructor(
        @InjectRepository(Server)
        private serverRepository: Repository<Server>,
    ) { }

    async onModuleInit() {
        await this.seedServers();
    }

    async seedServers() {
        const count = await this.serverRepository.count();
        if (count === 0) {
            const servers = [
                {
                    name: 'US East 1',
                    countryCode: 'US',
                    city: 'New York',
                    ipAddress: '192.168.1.10',
                    publicKey: 'fake-public-key-1',
                    capacity: 45,
                    status: ServerStatus.ONLINE,
                    wgApiUrl: 'http://us1.vpn.com:51821',
                    wgApiPassword: 'password123',
                },
                {
                    name: 'London Central',
                    countryCode: 'GB',
                    city: 'London',
                    ipAddress: '192.168.1.11',
                    publicKey: 'fake-public-key-2',
                    capacity: 78,
                    status: ServerStatus.ONLINE,
                    wgApiUrl: 'http://gb1.vpn.com:51821',
                    wgApiPassword: 'password456',
                },
                {
                    name: 'Tokyo Node',
                    countryCode: 'JP',
                    city: 'Tokyo',
                    ipAddress: '192.168.1.12',
                    publicKey: 'fake-public-key-3',
                    capacity: 12,
                    status: ServerStatus.ONLINE,
                    wgApiUrl: 'http://jp1.vpn.com:51821',
                    wgApiPassword: 'password789',
                },
            ];
            await this.serverRepository.save(servers);
            console.log('Seeded initial servers');
        }
    }

    async findAll(): Promise<Server[]> {
        // Return all servers for admin, maybe ordered by created date
        return this.serverRepository.find({
            order: { createdAt: 'DESC' },
        });
    }

    async create(data: Partial<Server>): Promise<Server> {
        const server = this.serverRepository.create(data);
        return this.serverRepository.save(server);
    }

    async update(id: string, data: Partial<Server>): Promise<Server> {
        const result = await this.serverRepository.update(id, data);
        if (result.affected === 0) {
            throw new NotFoundException(`Server with ID ${id} not found`);
        }
        return this.serverRepository.findOneByOrFail({ id });
    }

    async toggleStatus(id: string): Promise<Server> {
        const server = await this.serverRepository.findOneBy({ id });
        if (!server) {
            throw new NotFoundException(`Server with ID ${id} not found`);
        }
        server.status = server.status === ServerStatus.ONLINE ? ServerStatus.OFFLINE : ServerStatus.ONLINE;
        return this.serverRepository.save(server);
    }

    async delete(id: string): Promise<void> {
        const result = await this.serverRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Server with ID ${id} not found`);
        }
    }
}
