import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Server } from '../servers/server.entity';

@Entity()
export class Session {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: string;

    @ManyToOne(() => Server)
    @JoinColumn({ name: 'serverId' })
    server: Server;

    @Column()
    serverId: string;

    @Column()
    virtualIp: string;

    @CreateDateColumn()
    startTime: Date;

    @Column({ nullable: true })
    endTime: Date;

    @Column({ type: 'bigint', default: 0 })
    bytesReceived: number;

    @Column({ type: 'bigint', default: 0 })
    bytesSent: number;

    @Column({ default: true })
    isActive: boolean;

    @Column({ nullable: true })
    wgClientId: string;
}
