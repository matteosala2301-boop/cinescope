import { Card, Badge, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

// "Cartolina" di un singolo film. Riceve la prop "movie" e mostra i suoi dati.
// È riutilizzabile: lo stesso componente disegna film diversi.
export default function MovieCard({ movie }) {
  return (
    <Card className="h-100 shadow-sm movie-card">
      <div className="movie-card__poster">
        <Card.Img
          variant="top"
          src={movie.poster}
          alt={movie.title}
          // Se l'immagine del poster non carica, metto un'immagine segnaposto.
          onError={(e) => {
            e.currentTarget.src =
              "https://via.placeholder.com/500x750?text=No+Poster";
          }}
        />
      </div>
      <Card.Body className="d-flex flex-column">
        <Card.Title className="h6">{movie.title}</Card.Title>
        <div className="mb-2">
          <Badge bg="secondary" className="me-1">
            {movie.genre}
          </Badge>
          <Badge bg="light" text="dark">
            {movie.year}
          </Badge>
        </div>
        <div className="mb-3 text-warning fw-bold">★ {movie.rating}</div>
        {/* Bottone che porta alla pagina di dettaglio di QUESTO film (rotta dinamica) */}
        <Button
          as={Link}
          to={`/movies/${movie.id}`}
          variant="primary"
          size="sm"
          className="mt-auto"
        >
          View details
        </Button>
      </Card.Body>
    </Card>
  );
}
