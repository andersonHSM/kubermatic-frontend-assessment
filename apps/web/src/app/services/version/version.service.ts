import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Version } from '../../models/version.model';

@Injectable({
	providedIn: 'root',
})
export class VersionService {
	private readonly httpClient = inject(HttpClient);

	public findAll() {
		return this.httpClient.get<Version[]>('version');
	}
}
