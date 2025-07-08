<script lang="ts">
	import { Hammer } from '@lucide/svelte';
</script>

<div class="flex h-screen w-screen items-center justify-center p-8">
	<div class="flex flex-col items-center gap-4">
		<Hammer class="size-64 animate-bounce" />
		<p class="text-center text-2xl font-bold">
			Terima kasih sudah melalui tahapan <i>screening</i> 👍
		</p>
		<p class="text-center text-2xl font-bold">
			Dashboard, info data, dan lowongan sedang dalam pengerjaan 🚧
		</p>
		<p class="text-muted-foreground text-center font-bold">
			Tunggu minggu depan ya 😁
		</p>
	</div>
</div>
