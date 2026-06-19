import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Card, Badge, Button, Form, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { updateProfile, clearAuthError } from "../store/authSlice";
import ErrorMessage from "../components/ErrorMessage";

// Pagina profilo con form controllato per modificare nome ed email (con validazione).
export default function Profile() {
  const dispatch = useDispatch();
  const { user, status, error } = useSelector((state) => state.auth);

  const [editing, setEditing] = useState(false); // sono in modalità modifica?
  // Inizializzo il form direttamente dall'utente (così non serve un effect di sync).
  const [values, setValues] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
  });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false); // mostro il messaggio di successo?

  useEffect(() => () => dispatch(clearAuthError()), [dispatch]);

  // Apro il form di modifica, riempito con i dati attuali dell'utente.
  const startEditing = () => {
    setValues({ name: user.name, email: user.email });
    setSaved(false);
    setEditing(true);
  };

  if (!user) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const next = {};
    if (!values.name.trim()) {
      next.name = "Name is required";
    } else if (values.name.trim().length < 2) {
      next.name = "Name must be at least 2 characters";
    }
    if (!values.email.trim()) {
      next.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      next.email = "Enter a valid email address";
    }
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaved(false);
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    // Aspetto l'esito del thunk: se è andato a buon fine, chiudo il form.
    const result = await dispatch(
      updateProfile({
        id: user.id,
        name: values.name.trim(),
        email: values.email.trim(),
      })
    );
    if (updateProfile.fulfilled.match(result)) {
      setEditing(false);
      setSaved(true);
    }
  };

  return (
    <Container className="my-5" style={{ maxWidth: 520 }}>
      <Card className="shadow-sm">
        <Card.Body>
          <h1 className="h4 mb-4">My profile</h1>

          {saved && <Alert variant="success">Profile updated!</Alert>}
          <ErrorMessage message={error} />

          {/* Modalità visualizzazione VS modalità modifica (rendering condizionale) */}
          {!editing ? (
            <>
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Role:</strong>{" "}
                <Badge bg={user.role === "admin" ? "warning" : "info"}>
                  {user.role}
                </Badge>
              </p>

              <Button variant="primary" onClick={startEditing}>
                Edit profile
              </Button>

              {/* Scorciatoia alla dashboard, solo per l'admin */}
              {user.role === "admin" && (
                <Button
                  as={Link}
                  to="/dashboard"
                  variant="outline-secondary"
                  className="ms-2"
                >
                  Go to dashboard
                </Button>
              )}
            </>
          ) : (
            <Form noValidate onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="profile-name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  isInvalid={!!errors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="profile-email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Button
                type="submit"
                variant="primary"
                disabled={status === "loading"}
              >
                {status === "loading" ? "Saving..." : "Save changes"}
              </Button>
              {/* Annulla: chiudo il form e ripristino i valori originali */}
              <Button
                variant="link"
                onClick={() => {
                  setEditing(false);
                  setErrors({});
                  setValues({ name: user.name, email: user.email });
                }}
              >
                Cancel
              </Button>
            </Form>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
