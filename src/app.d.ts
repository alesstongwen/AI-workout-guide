// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

import type {KindeServerClient} from '@kinde-oss/kinde-auth-sveltekit';
declare global {
	namespace App {
		interface Locals {
			kinde: any;
		}
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
