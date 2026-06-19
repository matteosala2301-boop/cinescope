import { Container } from "react-bootstrap";

// Footer fisso in fondo a ogni pagina. new Date().getFullYear() mostra l'anno corrente.
export default function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <Container className="text-center">
        <small>
          🎬 CineScope — Frontend Programming Final Project · EPICODE ·{" "}
          {new Date().getFullYear()}
        </small>
      </Container>
    </footer>
  );
}
