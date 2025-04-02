<script lang="ts">
	import { onMount } from "svelte";
	import Navbar from "../lib/components/Navbar.svelte";
	
	export let data: {
		isAuthenticated: boolean;
		user: {
			id: string;
			email: string;
			given_name?: string;
			family_name?: string;
		} | null;
	};
	
	const { isAuthenticated, user } = data;
	
	let userInput = "";
	let chatResponse = "";
	let errorMessage = "";
	let isLoading = false;
	
	let goal = "Lose weight";
	let level = "Beginner";
	let daysPerWeek = 3;
	let duration = 30;
	let formattedResponse = "";
	
	type Workout = {
		id?: number;
		name: string;
		date: string;
	};
	
	let workouts: Workout[] = [];
	let completedWorkout = "";
	
	// Format AI responses for display
	function formatWorkoutPlan(text: string): string {
		return text
			.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
			.replace(/\n\n/g, "<br><br>")
			.replace(/\n/g, "<br>")
			.replace(/(\d+\.) /g, "<br><strong>$1</strong>")
			.replace(/-\s+/g, "– ")
			.trim();
	}
	
	// Fetch saved workouts
	async function fetchWorkouts() {
		try {
			const res = await fetch("/api/workouts");
			if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
			workouts = await res.json();
		} catch (error) {
			console.error("Error fetching workouts:", error);
			errorMessage = "Failed to fetch workouts.";
		}
	}
	
	// Save new workout entry
	async function logWorkout() {
		if (completedWorkout.trim() === "") return;
	
		try {
			const res = await fetch("/api/workouts", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name: completedWorkout, date: new Date().toLocaleDateString() })
			});
			if (!res.ok) throw new Error(`Log failed: ${res.status}`);
			completedWorkout = "";
			await fetchWorkouts(); // Refresh list
		} catch (error) {
			console.error("Error logging workout:", error);
			errorMessage = "Failed to log workout.";
		}
	}
	
	// Structured input to AI
	async function generateWorkoutPlan() {
		isLoading = true;
		errorMessage = "";
		chatResponse = "";
		formattedResponse = "";
	
		const payload = {
			goal,
			level,
			daysPerWeek,
			duration
		};
	
		try {
			const res = await fetch("/api/chatgpt", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload)
			});
	
			if (!res.ok) {
				const errText = await res.text();
				errorMessage = `Error: ${res.status} - ${errText}`;
				return;
			}
	
			const data = await res.json();
			chatResponse = data.message || "No response from AI.";
			formattedResponse = formatWorkoutPlan(chatResponse);
		} catch (err) {
			console.error("Error generating workout:", err);
			errorMessage = "Failed to generate workout.";
			chatResponse = "";
		} finally {
			isLoading = false;
		}
	}
	
	// Initial fetch of workouts
	onMount(fetchWorkouts);
	</script>
	

<Navbar {isAuthenticated} {user} />
<div>
    {#if isAuthenticated}
        <!-- Your existing workout UI -->
        <h2>Generate Workout Plan</h2>
        <!-- Your workout form and content -->
    {:else}
        <p>Please log in to access the workout planner.</p>
    {/if}
</div>
<main class="container">
	<h1>AI-Powered Workout Guide</h1>

	<div class="form">
		<div class="field">
			<label for="goal">Goal:</label>
			<select id="goal" bind:value={goal}>
				<option>Lose weight</option>
				<option>Build muscle</option>
				<option>Get toned</option>
			</select>
		</div>

		<div class="field">
			<label for="level">Fitness Level:</label>
			<select id="level" bind:value={level}>
				<option>Beginner</option>
				<option>Intermediate</option>
				<option>Advanced</option>
			</select>
		</div>

		<div class="field">
			<label for="days">Days per Week:</label>
			<input id="days" type="number" min="1" max="7" bind:value={daysPerWeek} />
		</div>

		<div class="field">
			<label for="duration">Minutes per Session:</label>
			<input id="duration" type="number" min="10" max="120" bind:value={duration} />
		</div>

		<button class="submit-btn" on:click={generateWorkoutPlan} disabled={isLoading}>
            Get Workout Plan
        </button>
		{#if isLoading}
			<div class="typing-indicator">
				<span class="dot"></span>
				<span class="dot"></span>
				<span class="dot"></span>
			</div>
		{/if}
        
        {#if chatResponse}
            <div class="response">
                <h2>AI Response:</h2>
                {@html formattedResponse}
            </div>
        {/if}
        
        {#if errorMessage}
            <p class="error">{errorMessage}</p>
        {/if}
        
        {#if typeof window !== 'undefined' && workouts.length > 0}
            <div class="workouts">
                <h2>Your Logged Workouts</h2>
                <ul class="workout-list">
                    {#each workouts as workout}
                        <li>{workout.date} - {workout.name}</li>
                    {/each}
                </ul>
            </div>
        {/if}
        
	</div>
</main>

<style>
	.container {
		max-width: 600px;
		margin: auto;
		text-align: center;
		padding: 2rem;
	}

	.form {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		margin-top: 2rem;
		text-align: left;
	}

	.field {
		display: flex;
		flex-direction: column;
	}

	label {
		margin-bottom: 0.5rem;
		font-weight: 500;
	}

	input,
	select {
		padding: 0.6rem;
		font-size: 1rem;
		border: 1px solid #ccc;
		border-radius: 0.4rem;
	}

	.submit-btn {
		margin-top: 1rem;
		padding: 0.8rem;
		background-color: #007bff;
		color: white;
		font-size: 1rem;
		border: none;
		border-radius: 0.5rem;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	.submit-btn:disabled {
		background-color: #cccccc;
		cursor: not-allowed;
	}

	.submit-btn:hover:enabled {
		background-color: #0056b3;
	}
    .workout-list {
	list-style: none;
	padding: 0;
	margin-top: 2rem;
	background-color: #f9f9f9;
	border-radius: 0.5rem;
	padding: 1rem;
}

.workout-list li {
	padding: 0.5rem 0;
	border-bottom: 1px solid #ddd;
}

.typing-indicator {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 0.3rem;
	margin-top: 1rem;
}

.dot {
	width: 10px;
	height: 10px;
	background-color: #007bff;
	border-radius: 50%;
	animation: bounce 1.2s infinite ease-in-out;
}

.dot:nth-child(2) {
	animation-delay: 0.2s;
}

.dot:nth-child(3) {
	animation-delay: 0.4s;
}

@keyframes bounce {
	0%, 80%, 100% {
		transform: scale(0);
	}
	40% {
		transform: scale(1);
	}
}

</style>
