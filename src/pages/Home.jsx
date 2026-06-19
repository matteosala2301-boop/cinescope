import { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { fetchAllMovies } from "../store/moviesSlice";
import MovieList from "../components/MovieList";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

// Homepage: banner di benvenuto + i film con il voto più alto.
export default function Home() {
  const dispatch = useDispatch();
  const { all, status, error } = useSelector((state) => state.movies);

  useEffect(() => {
    // Side effect: appena entro nella home carico tutti i film (una volta).
    dispatch(fetchAllMovies());
  }, [dispatch]);

  // Calcolo i 4 film col voto più alto. useMemo evita di rifare il calcolo
  // a ogni render: lo rifà solo se "all" cambia (ottimizzazione).
  const featured = useMemo(
    () => [...all].sort((a, b) => b.rating - a.rating).slice(0, 4),
    [all]
  );

  return (
    <>
      <div className="hero text-white text-center py-5">
        <Container>
          <h1 className="display-4 fw-bold">Welcome to CineScope 🎬</h1>
          <p className="lead">
            Discover, review and manage your favourite movies.
          </p>
          <Button as={Link} to="/movies" variant="light" size="lg">
            Browse all movies
          </Button>
        </Container>
      </div>

      <Container className="my-5">
        <Row className="mb-4">
          <Col>
            <h2 className="h4">⭐ Top rated</h2>
          </Col>
        </Row>

        {/* Rendering condizionale: mostro i film solo a caricamento riuscito,
            altrimenti il loader; in caso di errore l'ErrorMessage. */}
        {status === "succeeded" && <MovieList movies={featured} />}
        {(status === "loading" || status === "idle") && <Loader />}
        <ErrorMessage message={error} />
      </Container>
    </>
  );
}
