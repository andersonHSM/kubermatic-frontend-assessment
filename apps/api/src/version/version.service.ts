import { Injectable } from '@nestjs/common';

@Injectable()
export class VersionService {
	findAll() {
		return `This action returns all version`;
	}
}
