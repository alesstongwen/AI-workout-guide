<script lang="ts">
    import { onMount } from "svelte";

    let userInput = "";
    let chatResponse = "";
    let errorMessage = "";
    let isLoading = false;

    type Workout = {
        id?: number;    
        name: string;
        date: string;
    };

    let workouts: Workout[] = [];
    let completedWorkout = "";

    async function fetchWorkouts() {
    try {
        const res = await fetch("/api/workouts");
        if (!res.ok) {
            throw new Error(`Error: ${res.status} - ${await res.text()}`);
        }
        workouts = await res.json();
        console.log("Fetched workouts:", workouts);
    } catch (error) {
        console.error("Error fetching workouts:", error);
        errorMessage = "Failed to fetch workouts.";
    }
}


    async function logWorkout() {
        if (completedWorkout.trim() === "") return;

        try {
            const res = await fetch("/api/workouts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: completedWorkout, date: new Date().toLocaleDateString() })
            });

            if (!res.ok) {
                throw new Error(`Error: ${res.status} - ${await res.text()}`);
            }

            completedWorkout = "";
            fetchWorkouts(); // Refresh list
        } catch (error) {
            console.error("Error logging workout:", error);
            errorMessage = "Failed to log workout.";
        }
    }

    async function sendMessage() {
        if (isLoading) return;
        errorMessage = "";
        chatResponse = "Fetching workout plan...";
        isLoading = true;

        try {
            const res = await fetch("/api/chatgpt", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userInput })
            });

            if (!res.ok) {
                errorMessage = `Error: ${res.status} - ${await res.text()}`;
                chatResponse = "";
                return;
            }

            const data = await res.json();
            chatResponse = data.choices?.[0]?.message?.content || "No response from AI.";
        } catch (error) {
            errorMessage = "Failed to connect to the server.";
            chatResponse = "";
        } finally {
            isLoading = false;
        }
    }

    onMount(fetchWorkouts);
</script>

<main class="container">
    <h1>AI-Powered Workout Guide</h1>

    <!-- Workout Query -->
    <textarea bind:value={userInput} placeholder="Ask for a workout plan..."></textarea>
    <button on:click={sendMessage} disabled={isLoading}>Get Workout Plan</button>

    {#if errorMessage}
        <p class="error">{errorMessage}</p>
    {/if}

    {#if chatResponse}
        <div class="response">
            <p><strong>AI Response:</strong></p>
            <p>{chatResponse}</p>
        </div>
    {/if}
</main>

<style>
    .container {
        max-width: 600px;
        margin: auto;
        text-align: center;
        padding: 20px;
    }
    textarea, input {
        width: 100%;
        margin-bottom: 10px;
        padding: 8px;
    }
    button {
        background: #007bff;
        color: white;
        padding: 10px;
        border: none;
        cursor: pointer;
    }
    .response {
        margin-top: 20px;
        background: #f4f4f4;
        padding: 10px;
        border-radius: 5px;
    }
    .error {
        color: red;
        font-weight: bold;
        margin-top: 10px;
    }
</style>