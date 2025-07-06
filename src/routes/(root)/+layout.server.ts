import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (({ locals }) => {
	if (!locals.user) return redirect(302, '/login');
}) satisfies LayoutServerLoad;
