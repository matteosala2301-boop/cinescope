import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Container, Card } from "react-bootstrap";
import { createMovie } from "../store/moviesSlice";
import MovieForm from "../components/MovieForm";
import ErrorMessage from "../components/ErrorMessage";

// Pagina admin: crea un nuovo film riusando il MovieForm condiviso.
export default function CreateMovie() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Riceve i dati validati dal MovieForm e li manda al server.
  const handleSubmit = async (movie) => {
    setSubmitting(true);
    setError(null);
    try {
      // .unwrap() fa "scoppiare" l'errore se il thunk fallisce → entro nel catch.
      await dispatch(createMovie(movie)).unwrap();
      navigate("/dashboard"); // creato: torno alla dashboard
    } catch {
      setError("Could not create the movie. Is the server running?");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="my-4" style={{ maxWidth: 720 }}>
      <h1 className="h3 mb-4">Add a new movie</h1>
      <Card className="shadow-sm">
        <Card.Body>
          <ErrorMessage message={error} />
          {/* Stesso form di EditMovie, ma senza initialValues → campi vuoti */}
          <MovieForm
            onSubmit={handleSubmit}
            submitting={submitting}
            submitLabel="Create movie"
          />
        </Card.Body>
      </Card>
    </Container>
  );
}
