import { Injectable } from '@nestjs/common';

@Injectable()
export class RegionService {
	findAll() {
		return `This action returns all region`;
	}
}
