import importPlugin from 'eslint-plugin-import';
import baseConfig from './eslint.base.config.mjs';

export default [
	...baseConfig,
	importPlugin.flatConfigs.recommended,
	{
		ignores: [
			'**/dist',
			'**/node_modules',
			'**/coverage',
			'**/.nx',
			'**/.output',
			'**/.idea',
			'**/*.html',
			'**/output/**',
		],
	},
	{
		files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
		settings: {
			'import/resolver': {
				typescript: {
					alwaysTryTypes: true,
					typescript: true,
					node: true,
				},
			},
		},
		rules: {
			'import/first': ['error'],
			'import/order': [
				'error',
				{
					groups: [
						'builtin', // Node.js built-in modules
						'external', // Third-party modules
						'internal', // Project's internal modules
						'parent', // Parent directories
						'sibling', // Sibling directories
						'index', // Index files
						'object', // Object imports
						'type', // Type imports
					],
					'newlines-between': 'always', // Requires a blank line between import groups
					alphabetize: {
						order: 'asc',
						caseInsensitive: true,
					},
					named: {
						enabled: true,
					},
				},
			],
			'@nx/enforce-module-boundaries': [
				'error',
				{
					enforceBuildableLibDependency: true,
					allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
					depConstraints: [
						{
							sourceTag: '*',
							onlyDependOnLibsWithTags: ['*'],
						},
					],
				},
			],
		},
	},
	{
		files: [
			'**/*.ts',
			'**/*.tsx',
			'**/*.cts',
			'**/*.mts',
			'**/*.js',
			'**/*.jsx',
			'**/*.cjs',
			'**/*.mjs',
		],
		// Override or add rules here
		rules: {},
	},
];
