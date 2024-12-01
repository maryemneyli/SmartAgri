import { Injectable } from '@nestjs/common';
import * as client from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly httpRequestDuration: client.Histogram<string>;

  constructor() {
    // Registering a Histogram metric to track HTTP request durations
    this.httpRequestDuration = new client.Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.1, 0.5, 1, 2, 5], // Buckets for response times
    });

    // Register default metrics (e.g., CPU, memory usage)
    client.collectDefaultMetrics();
  }

  getMetrics() {
    // Returns metrics in Prometheus format
    return client.register.metrics();
  }

  recordHttpRequest(duration: number, method: string, route: string, statusCode: number) {
    this.httpRequestDuration.labels(method, route, statusCode.toString()).observe(duration);
  }
}
