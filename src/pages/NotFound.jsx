import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

// Pagina 404: mostrata quando l'indirizzo non corrisponde a nessuna rotta
// (la rotta "*" in App.jsx).
export default function NotFound() {
  return (
    <Container className="my-5 text-center">
      <h1 className="display-1 fw-bold">404</h1>
      <p className="lead">Oops! This page does not exist.</p>
      <Button as={Link} to="/" variant="primary">
        Back to home
      </Button>
    </Container>
  );
}
