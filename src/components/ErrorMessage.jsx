import { Alert } from "react-bootstrap";

// Banner d'errore riutilizzabile. Se non c'è messaggio non mostra nulla
// (return null) — esempio di rendering condizionale.
export default function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <Alert variant="danger" className="my-3">
      {message}
    </Alert>
  );
}
