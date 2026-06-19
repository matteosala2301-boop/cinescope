import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Card } from "react-bootstrap";
import { fetchMovieById, updateMovie } from "../store/moviesSlice";
import MovieForm from "../components/MovieForm";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

// Pagina admin: modifica un film esistente. Riusa il MovieForm, ma pre-compilato
// con i valori attuali (composizione di componenti).
export default function EditMovie() {
  const { id } = useParams(); // quale film modificare (dall'URL)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current, status } = useSelector((state) => state.movies);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Carico il film da modificare per riempire il form.
  useEffect(() => {
    dispatch(fetchMovieById(id));
  }, [dispatch, id]);

  const handleSubmit = async (movie) => {
    setSubmitting(true);
    setError(null);
    try {
      await dispatch(updateMovie({ id: Number(id), ...movie })).unwrap();
      navigate(`/movies/${id}`); // salvato: vado al dettaglio del film
    } catch {
      setError("Could not update the movie. Is the server running?");
    } finally {
      setSubmitting(false);
    }
  };

  // Finché il film non è caricato mostro il loader.
  if (status === "loading" || !current) return <Loader />;

  return (
    <Container className="my-4" style={{ maxWidth: 720 }}>
      <h1 className="h3 mb-4">Edit movie</h1>
      <Card className="shadow-sm">
        <Card.Body>
          <ErrorMessage message={error} />
          {/* initialValues={current} → il form parte pre-compilato */}
          <MovieForm
            initialValues={current}
            onSubmit={handleSubmit}
            submitting={submitting}
            submitLabel="Save changes"
          />
        </Card.Body>
      </Card>
    </Container>
  );
}
