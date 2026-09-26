import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { Repository } from 'typeorm';
import { CreateOrganizationDto } from './dto/create-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
  ) {}

  async findOneByName(organizationsName: string): Promise<Organization | null> {
    return await this.organizationRepository.findOne({
      where: { organizationsName },
    });
  }

  async createOrganization(organization: CreateOrganizationDto) {
    const found = await this.findOneByName(organization.organizationsName)

    if(found){
        throw new BadRequestException("Error: change the organization name")
    }

    const created = this.organizationRepository.create(organization)

    return this.organizationRepository.save(created);
  }
}
