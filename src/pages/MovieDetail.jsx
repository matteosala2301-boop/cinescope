import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col, Badge, Button, Image } from "react-bootstrap";
import { fetchMovieById, deleteMovie } from "../store/moviesSlice";
import {
  fetchReviews,
  addReview,
  deleteReview,
} from "../store/reviewsSlice";
import ReviewForm from "../components/ReviewForm";
import ReviewList from "../components/ReviewList";
import Loader from "../components/Loader";

// Pagina di dettaglio raggiunta tramite rotta dinamica: /movies/:id
export default function MovieDetail() {
  const { id } = useParams(); // leggo l'id dall'URL (es. "/movies/7" → id = "7")
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { current, status, error } = useSelector((state) => state.movies);
  const { items: reviews, status: reviewStatus } = useSelector(
    (state) => state.reviews
  );
  const user = useSelector((state) => state.auth.user);

  const [submitting, setSubmitting] = useState(false);

  // Carico il film e le sue recensioni. Le dipendenze [dispatch, id] fanno
  // ripartire l'effetto se cambio film (l'id cambia).
  useEffect(() => {
    dispatch(fetchMovieById(id));
    dispatch(fetchReviews(id));
  }, [dispatch, id]);

  // Invio una nuova recensione (allego id film, autore e data di oggi).
  const handleAddReview = async ({ rating, comment }) => {
    setSubmitting(true);
    await dispatch(
      addReview({
        movieId: Number(id),
        userId: user.id,
        username: user.name,
        rating,
        comment,
        date: new Date().toISOString().slice(0, 10), // formato AAAA-MM-GG
      })
    );
    setSubmitting(false);
  };

  const handleDeleteReview = (reviewId) => {
    dispatch(deleteReview(reviewId));
  };

  // Elimina il film (solo admin), con conferma, poi torna all'elenco.
  const handleDeleteMovie = async () => {
    if (window.confirm("Delete this movie permanently?")) {
      await dispatch(deleteMovie(Number(id)));
      navigate("/movies");
    }
  };

  // Tre situazioni gestite con return anticipati: caricamento, errore, dati pronti.
  if (status === "loading") return <Loader />;
  if (error) {
    return (
      <Container className="my-5 text-center">
        <h1 className="h3">Movie not found</h1>
        <p className="text-muted">
          Sorry, we couldn't find the movie you're looking for.
        </p>
        <Button as={Link} to="/movies" variant="primary">
          Back to movies
        </Button>
      </Container>
    );
  }
  if (!current) return null; // niente film ancora: non mostro nulla

  return (
    <Container className="my-4">
      <Button variant="link" className="px-0 mb-3" onClick={() => navigate(-1)}>
        ← Back
      </Button>

      <Row className="g-4">
        <Col md={4}>
          <Image
            src={current.poster}
            alt={current.title}
            fluid
            rounded
            onError={(e) => {
              e.currentTarget.src =
                "https://via.placeholder.com/500x750?text=No+Poster";
            }}
          />
        </Col>
        <Col md={8}>
          <h1>{current.title}</h1>
          <div className="mb-3">
            <Badge bg="secondary" className="me-2">
              {current.genre}
            </Badge>
            <Badge bg="light" text="dark" className="me-2">
              {current.year}
            </Badge>
            <Badge bg="warning" text="dark">
              ★ {current.rating}
            </Badge>
          </div>
          <p className="text-muted mb-1">
            <strong>Director:</strong> {current.director}
          </p>
          <p className="mt-3">{current.overview}</p>

          {/* Pulsanti di gestione visibili SOLO all'admin */}
          {user?.role === "admin" && (
            <div className="mt-4">
              <Button
                as={Link}
                to={`/dashboard/movies/${current.id}/edit`}
                variant="outline-primary"
                size="sm"
                className="me-2"
              >
                Edit
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={handleDeleteMovie}
              >
                Delete
              </Button>
            </div>
          )}
        </Col>
      </Row>

      <hr className="my-5" />

      <h2 className="h4 mb-3">Reviews</h2>

      {/* Solo gli utenti loggati vedono il form recensione (rendering condizionale) */}
      {user ? (
        <ReviewForm onSubmit={handleAddReview} submitting={submitting} />
      ) : (
        <p className="text-muted">
          <Link to="/login">Log in</Link> to leave a review.
        </p>
      )}

      {reviewStatus === "loading" ? (
        <Loader text="Loading reviews..." />
      ) : (
        <ReviewList
          reviews={reviews}
          currentUser={user}
          onDelete={handleDeleteReview}
        />
      )}
    </Container>
  );
}
