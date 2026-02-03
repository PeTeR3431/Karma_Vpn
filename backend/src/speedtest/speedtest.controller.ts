import { Controller, Get, Post, Res, Body, Header } from '@nestjs/common';
import type { Response } from 'express';
import { Readable } from 'stream';

@Controller('speedtest')
export class SpeedTestController {
    @Get('ping')
    ping() {
        return { timestamp: Date.now() };
    }

    @Get('download')
    @Header('Content-Type', 'application/octet-stream')
    @Header('Content-Disposition', 'attachment; filename=test.bin')
    async download(@Res() res: Response) {
        // Generate a stream of random data (approx 10MB)
        const size = 10 * 1024 * 1024; // 10MB
        const chunkSize = 64 * 1024; // 64KB chunks

        // Create a readable stream that pushes random data
        const stream = new Readable({
            read(n) {
                // Push until size reached
            }
        });

        // Simpler approach: write chunks to response
        let sent = 0;
        const buffer = Buffer.alloc(chunkSize, 'x'); // Filled with 'x' to be faster

        const write = () => {
            let ok = true;
            while (sent < size && ok) {
                if (sent + chunkSize > size) {
                    // Last chunk
                    const remaining = size - sent;
                    res.write(buffer.slice(0, remaining));
                    sent += remaining;
                    res.end();
                    return;
                }
                ok = res.write(buffer);
                sent += chunkSize;
            }
            if (sent < size) {
                res.once('drain', write);
            }
        };

        write();
    }

    @Post('upload')
    upload(@Body() body: any) {
        // Just receive data and return success
        return { received: true, timestamp: Date.now() };
    }
}
