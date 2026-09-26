import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Branch } from './entities/branch.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBranchDto } from './dto/create-branch.dto';

@Injectable()
export class BranchesService {
  constructor(
    @InjectRepository(Branch)
    private readonly branchesRepository: Repository<Branch>,
  ) {}

  findOneByName(
    branchName: string,
    id_organization: number,
  ): Promise<Branch | null> {
    return this.branchesRepository.findOne({
      where: { branchName, id_organization },
    });
  }

  async createBranch(branch: CreateBranchDto, id_organization: number) {
    const found = await this.findOneByName(branch.branchName, id_organization);

    if (found) {
      throw new BadRequestException('Error: change the branch name');
    }

    const created = this.branchesRepository.create(branch);
    return this.branchesRepository.save(created);
  }
}
