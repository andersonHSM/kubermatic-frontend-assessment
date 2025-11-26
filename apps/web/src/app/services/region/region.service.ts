import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Region } from '../../models/region.model';

@Injectable({
	providedIn: 'root',
})
export class RegionService {
	private readonly httpClient = inject(HttpClient);

	public findAll() {
		return this.httpClient.get<Region[]>('region');
	}
}
