import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { CreateBranchDto } from '../../branches/dto/create-branch.dto';
import { CreateOrganizationDto } from '@/organizations/dto/create-organization.dto';

export class CreateOperationDto {
  @ValidateNested()
  @Type(() => CreateOrganizationDto)
  organization: CreateOrganizationDto;

  @ValidateNested()
  @Type(() => CreateUserDto)
  adminUser: CreateUserDto;

  @ValidateNested()
  @Type(() => CreateBranchDto)
  mainBranch: CreateBranchDto;
}