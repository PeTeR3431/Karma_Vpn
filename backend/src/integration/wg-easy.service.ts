import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

export interface WgServerConfig {
    apiUrl: string;
    password?: string;
}

@Injectable()
export class WgEasyService {
    private readonly logger = new Logger(WgEasyService.name);
    private instances: Map<string, { axios: AxiosInstance; cookie: string | null }> = new Map();

    constructor(private configService: ConfigService) { }

    private async getInstance(config: WgServerConfig) {
        let instance = this.instances.get(config.apiUrl);
        if (!instance) {
            instance = {
                axios: axios.create({
                    baseURL: config.apiUrl,
                    timeout: 5000,
                }),
                cookie: null,
            };
            this.instances.set(config.apiUrl, instance);
        }
        return instance;
    }

    private async login(config: WgServerConfig) {
        const instance = await this.getInstance(config);
        const password = config.password || this.configService.get<string>('WG_EASY_PASSWORD');

        if (!password) {
            this.logger.error(`WG_EASY_PASSWORD not set for ${config.apiUrl}`);
            throw new Error('WG_EASY_PASSWORD not set');
        }

        try {
            const response = await instance.axios.post('/api/session', { password });
            const setCookie = response.headers['set-cookie'];
            if (setCookie && setCookie.length > 0) {
                instance.cookie = setCookie[0].split(';')[0];
                this.logger.log(`Logged into wg-easy successfully at ${config.apiUrl}`);
            } else {
                throw new Error('No cookie returned from wg-easy');
            }
        } catch (error) {
            this.logger.error(`Failed to login to wg-easy at ${config.apiUrl}: ${error.message}`);
            throw error;
        }
    }

    private async getHeaders(config: WgServerConfig) {
        const instance = await this.getInstance(config);
        if (!instance.cookie) {
            await this.login(config);
        }
        return {
            Cookie: instance.cookie,
        };
    }

    async createClient(config: WgServerConfig, name: string) {
        const instance = await this.getInstance(config);
        try {
            const headers = await this.getHeaders(config);
            const response = await instance.axios.post('/api/wireguard/client', { name }, { headers });
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                instance.cookie = null;
                return this.createClient(config, name);
            }
            this.logger.error(`Failed to create client in wg-easy at ${config.apiUrl}: ${error.message}`);
            throw error;
        }
    }

    async getClientConfig(config: WgServerConfig, clientId: string): Promise<string> {
        const instance = await this.getInstance(config);
        try {
            const headers = await this.getHeaders(config);
            const response = await instance.axios.get(`/api/wireguard/client/${clientId}/configuration`, { headers });
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                instance.cookie = null;
                return this.getClientConfig(config, clientId);
            }
            this.logger.error(`Failed to get client config from wg-easy at ${config.apiUrl}: ${error.message}`);
            throw error;
        }
    }

    async deleteClient(config: WgServerConfig, clientId: string) {
        const instance = await this.getInstance(config);
        try {
            const headers = await this.getHeaders(config);
            await instance.axios.delete(`/api/wireguard/client/${clientId}`, { headers });
        } catch (error) {
            if (error.response?.status === 401) {
                instance.cookie = null;
                return this.deleteClient(config, clientId);
            }
            this.logger.error(`Failed to delete client from wg-easy at ${config.apiUrl}: ${error.message}`);
            throw error;
        }
    }
}
