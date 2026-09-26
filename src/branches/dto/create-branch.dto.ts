import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBranchDto {
  @IsNotEmpty()
  @IsString()
  branchName: string;

  @IsString()
  @IsOptional()
  address: string;
}
