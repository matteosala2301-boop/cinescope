import { Card, Button } from "react-bootstrap";
import RatingStars from "./RatingStars";

// Elenco delle recensioni di un film. Il bottone "Delete" appare solo sulla
// recensione propria (o a un admin) → rendering condizionale per proprietà/ruolo.
export default function ReviewList({ reviews, currentUser, onDelete }) {
  if (!reviews || reviews.length === 0) {
    return <p className="text-muted">No reviews yet. Be the first!</p>;
  }

  return (
    <div className="d-flex flex-column gap-3">
      {reviews.map((review) => {
        // Posso cancellare se sono l'autore della recensione, oppure se sono admin.
        const canDelete =
          currentUser &&
          (currentUser.id === review.userId || currentUser.role === "admin");

        return (
          <Card key={review.id} className="shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <strong>{review.username}</strong>
                  {/* qui RatingStars è in sola lettura (niente onChange) */}
                  <RatingStars value={review.rating} size="1rem" />
                </div>
                <small className="text-muted">{review.date}</small>
              </div>
              <p className="mb-2 mt-2">{review.comment}</p>
              {canDelete && (
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => onDelete(review.id)}
                >
                  Delete
                </Button>
              )}
            </Card.Body>
          </Card>
        );
      })}
    </div>
  );
}
