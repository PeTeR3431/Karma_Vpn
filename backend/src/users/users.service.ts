import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService implements OnModuleInit {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async onModuleInit() {
        await this.seedUsers();
    }

    async seedUsers() {
        if (await this.usersRepository.count() === 0) {
            const users = [
                { deviceId: 'android-pixel-7-admin', isPremium: true, lastLoginAt: new Date() },
                { deviceId: 'iphone-14-pro', isPremium: false, lastLoginAt: new Date(Date.now() - 86400000) },
                { deviceId: 'windows-pc-client', isPremium: false, lastLoginAt: new Date(Date.now() - 172800000) },
            ];
            // Use create/save to ensure defaults (isActive=true)
            await this.usersRepository.save(this.usersRepository.create(users));
            console.log('Seeded initial users');
        }
    }

    async findOrCreateByDeviceId(deviceId: string): Promise<User> {
        let user = await this.usersRepository.findOne({ where: { deviceId } });
        if (!user) {
            user = this.usersRepository.create({ deviceId });
            await this.usersRepository.save(user);
        } else {
            await this.usersRepository.update(user.id, { lastLoginAt: new Date() });
        }
        return user;
    }

    async findAll(): Promise<User[]> {
        return this.usersRepository.find({
            order: { lastLoginAt: 'DESC' },
            take: 50 // Limit to 50 for now
        });
    }

    async update(id: string, data: Partial<User>): Promise<User> {
        const result = await this.usersRepository.update(id, data);
        if (result.affected === 0) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        const user = await this.usersRepository.findOneBy({ id });
        if (!user) throw new NotFoundException();
        return user;
    }

    async getStats() {
        const total = await this.usersRepository.count();
        const premium = await this.usersRepository.count({ where: { isPremium: true } });
        const free = total - premium;
        return { total, premium, free };
    }
}
