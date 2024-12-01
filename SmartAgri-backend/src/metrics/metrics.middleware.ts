import { Injectable, NestMiddleware } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  constructor(private readonly metricsService: MetricsService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();

    res.on('finish', () => {
      const duration = (Date.now() - startTime) / 1000; // Convert to seconds
      this.metricsService.recordHttpRequest(
        duration,
        req.method,
        req.route?.path || req.url,
        res.statusCode
      );
    });

    next();
  }
}
