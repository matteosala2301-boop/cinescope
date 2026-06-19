import { Spinner } from "react-bootstrap";

// Componente riutilizzabile per lo stato di caricamento (lo spinner che gira).
// La prop "text" ha un valore di default, così posso anche non passarla.
export default function Loader({ text = "Loading..." }) {
  return (
    <div className="text-center my-5">
      <Spinner animation="border" role="status" variant="primary" />
      <p className="mt-2 text-muted">{text}</p>
    </div>
  );
}
