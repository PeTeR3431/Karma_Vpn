import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum ServerStatus {
    ONLINE = 'ONLINE',
    OFFLINE = 'OFFLINE',
    MAINTENANCE = 'MAINTENANCE',
}

@Entity()
export class Server {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    countryCode: string;

    @Column({ nullable: true })
    city: string;

    @Column()
    ipAddress: string;

    @Column()
    publicKey: string;

    @Column({ default: 0 })
    capacity: number; // 0-100 load percentage

    @Column({
        type: 'enum',
        enum: ServerStatus,
        default: ServerStatus.ONLINE,
    })
    status: ServerStatus;

    @Column({ nullable: true })
    flagUrl: string;

    @Column({ nullable: true })
    wgApiUrl: string;

    @Column({ nullable: true, select: false }) // Hide password by default in queries
    wgApiPassword: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
