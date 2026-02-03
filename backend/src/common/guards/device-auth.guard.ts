import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/users.service';

@Injectable()
export class DeviceAuthGuard implements CanActivate {
    constructor(private usersService: UsersService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const deviceId = request.headers['x-device-id'];

        if (!deviceId) {
            // Option: Allow requests without ID but mark as anonymous, or Block.
            // For now, let's block or create a temporary 'unknown' flow.
            // But the requirement says "Send it with every API request".
            // So request without ID is invalid.
            console.warn('Request missing x-device-id header');
            return false; // Or throw UnauthorizedException
        }

        try {
            const user = await this.usersService.findOrCreateByDeviceId(deviceId as string);
            request.user = user;
            return true;
        } catch (error) {
            console.error('Auth Error', error);
            return false;
        }
    }
}
