import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WgEasyService } from './wg-easy.service';

@Module({
    imports: [ConfigModule],
    providers: [WgEasyService],
    exports: [WgEasyService],
})
export class IntegrationModule { }
