import {provideHttpClient} from '@angular/common/http';
import {ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection,} from '@angular/core';
import {
	provideClientHydration,
	withEventReplay
} from '@angular/platform-browser';
import {
	provideAnimationsAsync
} from '@angular/platform-browser/animations/async';
import {provideRouter} from '@angular/router';
import Aura from '@primeuix/themes/aura';
import {providePrimeNG} from 'primeng/config';

import {appRoutes} from './app.routes';

export const appConfig: ApplicationConfig = {
	providers: [
		provideAnimationsAsync(),
		providePrimeNG({
			theme: {
				preset: Aura,
			},
		}),
		provideClientHydration(withEventReplay()),
		provideBrowserGlobalErrorListeners(),
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(appRoutes),
		provideHttpClient(),
	],
};

