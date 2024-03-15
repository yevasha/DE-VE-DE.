<script>
  import { onMount } from "svelte";
  import { firestore } from "$lib/firebase-config";
  import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    doc,
    deleteDoc,
    updateDoc,
  } from "firebase/firestore";

  let title = "",
    genre = "",
    releaseDate = "",
    watched = false;
  let movies = [];
  let editingMovieId = null;

  onMount(async () => {
    fetchMovies();
  });

  async function fetchMovies() {
    const querySnapshot = await getDocs(collection(firestore, "movies"));
    movies = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  async function addMovie(event) {
    event.preventDefault();
    if (editingMovieId) {
      await updateMovie();
    } else {
      await addMovieIfNotExists({ title, genre, releaseDate, watched });
    }
    // Reset fields
    title = genre = releaseDate = "";
    watched = false;
    editingMovieId = null;
  }

  async function addMovieIfNotExists(newMovie) {
    const q = query(
      collection(firestore, "movies"),
      where("title", "==", newMovie.title),
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      try {
        await addDoc(collection(firestore, "movies"), newMovie);
        console.log("Movie added:", newMovie.title);
        fetchMovies(); // Refresh the list
      } catch (e) {
        console.error("Error adding movie:", e);
      }
    } else {
      alert(`A movie with the title '${newMovie.title}' already exists.`);
    }
  }

  async function updateMovie() {
    const movieRef = doc(firestore, "movies", editingMovieId);
    await updateDoc(movieRef, { title, genre, releaseDate, watched });
    console.log("Movie updated:", title);
    fetchMovies(); // Refresh the list
  }

  function editMovie(movieId) {
    const movie = movies.find((m) => m.id === movieId);
    title = movie.title;
    genre = movie.genre;
    releaseDate = movie.releaseDate;
    watched = movie.watched;
    editingMovieId = movieId;
  }

  async function deleteMovie(movieId) {
    await deleteDoc(doc(firestore, "movies", movieId));
    fetchMovies(); // Refresh the list
  }
</script>

{#if editingMovieId}
  {console.log("edit movie id", editingMovieId)}
  <!-- Show your form here, pre-filled with the selected movie's data -->
  <form on:submit|preventDefault={updateMovie}></form>
{/if}

<div class="w-3/5 m-4">
  <form on:submit|preventDefault={addMovie}>
    <div class="form-control">
      <label class="label">
        <span class="label-text">Title</span>
      </label>
      <input
        type="text"
        bind:value={title}
        class="input input-bordered"
        required
      />

      <label class="label">
        <span class="label-text">Genre</span>
      </label>
      <input
        type="text"
        bind:value={genre}
        class="input input-bordered"
        required
      />

      <label class="label">
        <span class="label-text">Release Date</span>
      </label>
      <input
        type="date"
        bind:value={releaseDate}
        class="input input-bordered"
        required
      />
    </div>

    <label class="label flex items-center">
      <input
        type="checkbox"
        bind:checked={watched}
        class="checkbox checkbox-primary"
      />
      <span class="label-text ml-2">Watched</span>
    </label>

    ...
    <div class="form-control mt-6">
      <button type="submit" class="btn btn-primary">Submit</button>
    </div>
  </form>
</div>

<div class="flex flex-wrap mt-4">
  {#each movies as movie}
    <div class="card w-96 bg-base-100 shadow-xl m-4">
      <div class="card-body">
        <h2 class="card-title">Title: {movie.title}</h2>
        <p>Genre: {movie.genre}</p>
        <p>Release date: {movie.releaseDate}</p>
        <div class="card-actions justify-end">
          <button class="btn btn-primary" on:click={() => editMovie(movie.id)}
            >Edit</button
          >
          <button
            class="btn btn-primary w-20"
            on:click={() => deleteMovie(movie.id)}>Delete</button
          >
        </div>
      </div>
    </div>
  {/each}
</div>
