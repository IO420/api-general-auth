import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOperationDto } from './dto/create-operation.dto';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { Organization } from '../organizations/entities/organization.entity';
import { User, UserRole } from '../users/entities/user.entity';
import { Branch } from '../branches/entities/branch.entity';

@Injectable()
export class OperationsService {
  constructor(private readonly dataSource: DataSource) {}

  async registerOrganization(dto: CreateOperationDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingOrg = await queryRunner.manager.findOne(Organization, {
        where: { organizationsName: dto.organization.organizationsName },
      });
      if (existingOrg)
        throw new BadRequestException('Organization name already exists');

      const org = queryRunner.manager.create(Organization, dto.organization);
      const savedOrg = await queryRunner.manager.save(org);

      const existingUser = await queryRunner.manager.findOne(User, {
        where: { userName: dto.adminUser.userName },
      });
      if (existingUser) throw new BadRequestException('Username already taken');

      const hashedPassword = await bcrypt.hash(dto.adminUser.password, 10);

      const branch = queryRunner.manager.create(Branch, {
        ...dto.mainBranch,
        id_organization: savedOrg.id_organization,
      });
      const savedBranch = await queryRunner.manager.save(branch);

      const user = queryRunner.manager.create(User, {
        ...dto.adminUser,
        password: hashedPassword,
        id_organization: savedOrg.id_organization,
        role: UserRole.Admin,
        owner: true,
        branches: [savedBranch],
      });
      const savedUser = await queryRunner.manager.save(user);

      await queryRunner.commitTransaction();

      const { password, ...cleanUser } = savedUser;
      return {
        organization: savedOrg,
        branch: savedBranch,
        admin: cleanUser,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
//IO