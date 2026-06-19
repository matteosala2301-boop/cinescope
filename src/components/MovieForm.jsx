import { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";

const GENRES = ["Action", "Sci-Fi", "Drama", "Crime", "Animation"];
const CURRENT_YEAR = new Date().getFullYear(); // l'anno di oggi, per validare l'anno

// Form vuoto di partenza (un campo per ogni proprietà del film).
const EMPTY = {
  title: "",
  year: "",
  genre: "",
  director: "",
  rating: "",
  poster: "",
  overview: "",
};

// Form controllato per CREARE o MODIFICARE un film, con validazione completa.
// Lo stesso componente serve a entrambe: se gli passo initialValues, parte pre-compilato.
export default function MovieForm({ initialValues, onSubmit, submitting, submitLabel = "Save" }) {
  // Stato dei campi: vuoto per creare, riempito con initialValues per modificare.
  const [values, setValues] = useState({ ...EMPTY, ...initialValues });
  const [errors, setErrors] = useState({});

  // A ogni tasto aggiorno SOLO il campo toccato ([name]: value), tenendo gli altri.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  // Validazione: costruisco un oggetto { campo: messaggio } con tutti gli errori.
  const validate = () => {
    const next = {};

    if (!values.title.trim()) {
      next.title = "Title is required";
    }

    if (!String(values.year).trim()) {
      next.year = "Year is required";
    } else if (
      // l'anno deve essere 4 cifre (regex) ed entro un intervallo sensato
      !/^\d{4}$/.test(String(values.year)) ||
      Number(values.year) < 1888 ||
      Number(values.year) > CURRENT_YEAR + 5
    ) {
      next.year = `Enter a valid year (1888 - ${CURRENT_YEAR + 5})`;
    }

    if (!values.genre) {
      next.genre = "Please select a genre";
    }

    if (!values.director.trim()) {
      next.director = "Director is required";
    }

    if (String(values.rating).trim() === "") {
      next.rating = "Rating is required";
    } else if (
      // il voto deve essere un numero tra 0 e 10
      isNaN(Number(values.rating)) ||
      Number(values.rating) < 0 ||
      Number(values.rating) > 10
    ) {
      next.rating = "Rating must be a number between 0 and 10";
    }

    // il poster è facoltativo, ma se c'è deve essere un URL http/https
    if (values.poster && !/^https?:\/\/.+/i.test(values.poster)) {
      next.poster = "Poster must be a valid URL (http/https)";
    }

    if (!values.overview.trim()) {
      next.overview = "Overview is required";
    } else if (values.overview.trim().length < 10) {
      next.overview = "Overview must be at least 10 characters";
    }

    return next;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    // Se la validazione ha trovato errori mi fermo: niente dati sbagliati al server.
    if (Object.keys(validationErrors).length > 0) return;

    // Tutto ok: passo i dati al genitore (CreateMovie/EditMovie), convertendo
    // anno e voto in numeri e mettendo un poster segnaposto se vuoto.
    onSubmit({
      ...values,
      year: Number(values.year),
      rating: Number(values.rating),
      poster:
        values.poster.trim() ||
        "https://via.placeholder.com/500x750?text=No+Poster",
    });
  };

  return (
    // noValidate disattiva la validazione HTML: la gestisco io con validate().
    <Form noValidate onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="title">
        <Form.Label>Title *</Form.Label>
        <Form.Control
          name="title"
          value={values.title} // value legato allo stato = campo controllato
          onChange={handleChange}
          isInvalid={!!errors.title} // bordo rosso se c'è errore su questo campo
        />
        <Form.Control.Feedback type="invalid">
          {errors.title}
        </Form.Control.Feedback>
      </Form.Group>

      <Row>
        <Col md={4}>
          <Form.Group className="mb-3" controlId="year">
            <Form.Label>Year *</Form.Label>
            <Form.Control
              name="year"
              value={values.year}
              onChange={handleChange}
              isInvalid={!!errors.year}
            />
            <Form.Control.Feedback type="invalid">
              {errors.year}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3" controlId="genre">
            <Form.Label>Genre *</Form.Label>
            <Form.Select
              name="genre"
              value={values.genre}
              onChange={handleChange}
              isInvalid={!!errors.genre}
            >
              <option value="">Select...</option>
              {GENRES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.genre}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3" controlId="rating">
            <Form.Label>Rating (0-10) *</Form.Label>
            <Form.Control
              name="rating"
              value={values.rating}
              onChange={handleChange}
              isInvalid={!!errors.rating}
            />
            <Form.Control.Feedback type="invalid">
              {errors.rating}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3" controlId="director">
        <Form.Label>Director *</Form.Label>
        <Form.Control
          name="director"
          value={values.director}
          onChange={handleChange}
          isInvalid={!!errors.director}
        />
        <Form.Control.Feedback type="invalid">
          {errors.director}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="poster">
        <Form.Label>Poster URL</Form.Label>
        <Form.Control
          name="poster"
          value={values.poster}
          onChange={handleChange}
          isInvalid={!!errors.poster}
          placeholder="https://..."
        />
        <Form.Control.Feedback type="invalid">
          {errors.poster}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="overview">
        <Form.Label>Overview *</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          name="overview"
          value={values.overview}
          onChange={handleChange}
          isInvalid={!!errors.overview}
        />
        <Form.Control.Feedback type="invalid">
          {errors.overview}
        </Form.Control.Feedback>
      </Form.Group>

      {/* submitLabel cambia il testo: "Create movie" o "Save changes" */}
      <Button type="submit" variant="primary" disabled={submitting}>
        {submitting ? "Saving..." : submitLabel}
      </Button>
    </Form>
  );
}
