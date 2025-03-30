<!-- src/lib/components/Navbar.svelte -->
<script lang="ts">
	export let isAuthenticated: boolean;
	export let user: any;
</script>

<nav class="navbar">
	<div class="logo">💪 AI Workout Guide</div>
	<div class="nav-links">
		{#if isAuthenticated}
			<span class="user">Hi, {user?.given_name}</span>
			<a href="/api/auth/logout">Logout</a>
		{:else}
			<a href="/api/auth/login">Login</a>
		{/if}
	</div>
</nav>

<style>
	.navbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 2rem;
		background-color: #f0f0f0;
		border-bottom: 1px solid #ddd;
	}
	.logo {
		font-weight: bold;
		font-size: 1.2rem;
	}
	.nav-links {
		display: flex;
		gap: 1rem;
		align-items: center;
	}
	.user {
		font-weight: 500;
		color: #007bff;
	}
	a {
		text-decoration: none;
		color: #333;
		font-weight: bold;
	}
	a:hover {
		color: #007bff;
	}
</style>
