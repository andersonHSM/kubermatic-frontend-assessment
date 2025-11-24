import { Labels } from './labels.mdel';
import { Region } from './region.model';
import { Version } from './version.model';

export interface Cluster {
	id: string;
	name: string;
	nodeCount: number;
	status: string;
	labels: Labels;
	createdAt: string;
	updatedAt: string;
	projectId: string;
	regionId: string;
	versionId: string;
	region: Region;
	version: Version;
}
