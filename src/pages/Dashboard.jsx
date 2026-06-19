import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Table, Button, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { fetchAllMovies, deleteMovie } from "../store/moviesSlice";
import Loader from "../components/Loader";

// Dashboard solo-admin: tabella per gestire il catalogo film (punto d'accesso al CRUD).
export default function Dashboard() {
  const dispatch = useDispatch();
  const { all, status } = useSelector((state) => state.movies);

  // Carico tutti i film all'apertura della dashboard.
  useEffect(() => {
    dispatch(fetchAllMovies());
  }, [dispatch]);

  // Elimino un film dopo conferma.
  const handleDelete = (id, title) => {
    if (window.confirm(`Delete "${title}"?`)) {
      dispatch(deleteMovie(id));
    }
  };

  return (
    <Container className="my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Admin dashboard</h1>
        {/* Bottone che porta al form di creazione */}
        <Button as={Link} to="/dashboard/movies/new" variant="success">
          + Add movie
        </Button>
      </div>

      {/* Loader solo al primo caricamento (quando la lista è ancora vuota) */}
      {status === "loading" && all.length === 0 ? (
        <Loader />
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Year</th>
              <th>Genre</th>
              <th>Rating</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Una riga per ogni film */}
            {all.map((movie) => (
              <tr key={movie.id}>
                <td>{movie.id}</td>
                <td>{movie.title}</td>
                <td>{movie.year}</td>
                <td>
                  <Badge bg="secondary">{movie.genre}</Badge>
                </td>
                <td>★ {movie.rating}</td>
                <td className="text-end">
                  <Button
                    as={Link}
                    to={`/movies/${movie.id}`}
                    variant="outline-secondary"
                    size="sm"
                    className="me-2"
                  >
                    View
                  </Button>
                  <Button
                    as={Link}
                    to={`/dashboard/movies/${movie.id}/edit`}
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(movie.id, movie.title)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
