import { Module } from '@nestjs/common';
import { SpeedTestController } from './speedtest.controller';

@Module({
    controllers: [SpeedTestController],
})
export class SpeedTestModule { }
