import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container } from "react-bootstrap";
import { fetchMovies } from "../store/moviesSlice";
import MovieList from "../components/MovieList";
import SearchFilters from "../components/SearchFilters";
import PaginationBar from "../components/PaginationBar";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

const PAGE_SIZE = 6; // film per pagina

// Pagina elenco film, con filtri (ricerca, genere, ordinamento) e paginazione.
export default function Movies() {
  const dispatch = useDispatch();
  // Leggo dallo store i film della pagina, il totale, lo stato e l'errore.
  const { items, total, status, error } = useSelector((state) => state.movies);

  // Stato locale della pagina (useState): i filtri e la pagina corrente.
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);

  // Debounce: aspetto 400ms dopo l'ultimo tasto prima di applicare la ricerca,
  // così non chiamo il server a ogni lettera. Quando "si calma", torno a pagina 1.
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    // cleanup: annullo il timer precedente a ogni tasto (cuore del debounce)
    return () => clearTimeout(t);
  }, [search]);

  // Cambiare genere o ordinamento riporta a pagina 1. Lo faccio negli handler
  // (non in un effect) per evitare render in più.
  const handleGenreChange = (value) => {
    setGenre(value);
    setPage(1);
  };
  const handleSortChange = (value) => {
    setSort(value);
    setPage(1);
  };

  // Carico i film ogni volta che cambia pagina, ricerca, genere o ordinamento.
  useEffect(() => {
    dispatch(
      fetchMovies({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch,
        genre,
        sort,
      })
    );
  }, [dispatch, page, debouncedSearch, genre, sort]);

  // Numero di pagine = totale film diviso per quanti ne mostro, arrotondato su.
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <Container className="my-4">
      <h1 className="h3 mb-4">All movies</h1>

      <SearchFilters
        search={search}
        genre={genre}
        sort={sort}
        onSearchChange={setSearch}
        onGenreChange={handleGenreChange}
        onSortChange={handleSortChange}
      />

      <ErrorMessage message={error} />

      {/* Durante il caricamento mostro il loader, altrimenti i risultati */}
      {status === "loading" ? (
        <Loader />
      ) : (
        <>
          <p className="text-muted">{total} movie(s) found</p>
          <MovieList movies={items} />
          <PaginationBar
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </Container>
  );
}
