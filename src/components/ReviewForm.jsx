import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import RatingStars from "./RatingStars";

// Form controllato per scrivere una recensione (voto + commento), con validazione.
// Lo usano solo gli utenti loggati, nella pagina di dettaglio del film.
export default function ReviewForm({ onSubmit, submitting }) {
  const [rating, setRating] = useState(0); // stelle selezionate
  const [comment, setComment] = useState(""); // testo del commento
  const [errors, setErrors] = useState({}); // eventuali errori di validazione

  // Controllo i campi e raccolgo i messaggi d'errore.
  const validate = () => {
    const next = {};
    if (rating < 1 || rating > 5) {
      next.rating = "Please select a rating (1-5 stars)";
    }
    if (!comment.trim()) {
      next.comment = "Comment is required";
    } else if (comment.trim().length < 5) {
      next.comment = "Comment must be at least 5 characters";
    }
    return next;
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // evito il ricaricamento di pagina del form
    const validationErrors = validate();
    setErrors(validationErrors);
    // Se ci sono errori mi fermo qui: non mando nulla.
    if (Object.keys(validationErrors).length > 0) return;

    onSubmit({ rating, comment: comment.trim() }); // passo i dati al genitore
    // Svuoto il form dopo l'invio.
    setRating(0);
    setComment("");
    setErrors({});
  };

  return (
    <Form noValidate onSubmit={handleSubmit} className="mb-4">
      <Form.Group className="mb-2">
        <Form.Label className="d-block">Your rating *</Form.Label>
        {/* RatingStars qui è interattivo perché gli passo onChange={setRating} */}
        <RatingStars value={rating} onChange={setRating} />
        {errors.rating && (
          <div className="text-danger small mt-1">{errors.rating}</div>
        )}
      </Form.Group>

      <Form.Group className="mb-3" controlId="comment">
        <Form.Label>Your review *</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)} // form controllato
          isInvalid={!!errors.comment} // bordo rosso se c'è errore
          placeholder="What did you think of this movie?"
        />
        <Form.Control.Feedback type="invalid">
          {errors.comment}
        </Form.Control.Feedback>
      </Form.Group>

      {/* submitting disabilita il bottone durante l'invio */}
      <Button type="submit" variant="success" disabled={submitting}>
        {submitting ? "Posting..." : "Post review"}
      </Button>
    </Form>
  );
}
