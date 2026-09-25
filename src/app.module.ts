import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { BranchesModule } from './branches/branches.module';
import { OrganizationsModule } from './organizations/organizations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        console.log('[AppModule] Configurando conexión a base de datos');
        console.log(
          `[AppModule] Timezone: ${configService.get('DB_TIMEZONE') || '+00:00'}`,
        );
        console.log(
          `[AppModule] Hora actual del sistema: ${new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}`,
        );

        return {
          type: 'mariadb',
          host: configService.get<string>('api_db_host'),
          port: configService.get<number>('api_db_port'),
          username: configService.get<string>('api_db_username'),
          password: configService.get<string>('api_db_password'),
          database: configService.get<string>('api_db_database'),
          synchronize: true,
          dropSchema: false,
          autoLoadEntities: true,
          timezone: '+00:00',
        };
      },
    }),
    UsersModule,
    BranchesModule,
    OrganizationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
