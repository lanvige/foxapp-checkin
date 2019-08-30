import {
  TerminusEndpoint,
  TerminusOptionsFactory,
  DNSHealthIndicator,
  TerminusModuleOptions,
} from '@nestjs/terminus';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TerminusOptionsService implements TerminusOptionsFactory {
  constructor(private readonly dns: DNSHealthIndicator) {}

  createTerminusOptions(): TerminusModuleOptions {
    const healthEndpoint: TerminusEndpoint = {
      url: 'v1/health',
      healthIndicators: [
        async () => this.dns.pingCheck('baidu', 'https://baidu.com'),
      ],
    };

    return {
      endpoints: [healthEndpoint],
    };
  }
}
