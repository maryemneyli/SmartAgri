import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SensorsModule } from './sensors/sensors.module';
import { JwtModule } from '@nestjs/jwt';
import { MetricsModule } from './metrics/metrics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      //'mongodb+srv://iheb:kZBTzoclQGexgNfR@cluster0.eja8elm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
      'mongodb+srv://admin:admin@cluster0.p5aaq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
    ),
    MetricsModule,
    AuthModule,
    SensorsModule,
    JwtModule.register({
      secret: 'yourSecretKey',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
