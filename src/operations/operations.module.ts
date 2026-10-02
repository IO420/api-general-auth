import { Module } from '@nestjs/common';
import { OperationsService } from './operations.service';
import { OperationsController } from './operations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from '@/organizations/entities/organization.entity';
import { Branch } from '@/branches/entities/branch.entity';
import { User } from '@/users/entities/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Organization,User])],
  controllers: [OperationsController],
  providers: [OperationsService],
})
export class OperationsModule {}
