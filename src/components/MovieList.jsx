import { Row, Col } from "react-bootstrap";
import MovieCard from "./MovieCard";

// Griglia di film: riceve un array "movies" e per ognuno disegna una MovieCard.
// È composizione: un componente che ne usa un altro.
export default function MovieList({ movies }) {
  // Se non ci sono film mostro un messaggio invece della griglia vuota.
  if (!movies || movies.length === 0) {
    return <p className="text-center text-muted my-5">No movies found.</p>;
  }

  return (
    <Row xs={1} sm={2} md={3} lg={4} className="g-4">
      {/* .map() trasforma ogni film in una card. key={movie.id} serve a React. */}
      {movies.map((movie) => (
        <Col key={movie.id}>
          <MovieCard movie={movie} />
        </Col>
      ))}
    </Row>
  );
}
