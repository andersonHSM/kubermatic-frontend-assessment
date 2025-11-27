import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsObject, IsString } from 'class-validator';

export class CreateClusterDto {
	@ApiProperty()
	@IsString()
	name: string;

	@ApiProperty()
	@IsString()
	regionId: string;

	@ApiProperty()
	@IsString()
	versionId: string;

	@ApiProperty()
	@IsObject()
	labels: Record<string, string>;

	@ApiProperty()
	@IsNumber()
	nodeCount: number;
}
