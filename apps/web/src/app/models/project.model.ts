import { Cluster } from './cluster.model';

export interface Project {
	id: string;
	name: string;
	description: string;
	clusters: Cluster[];
}
