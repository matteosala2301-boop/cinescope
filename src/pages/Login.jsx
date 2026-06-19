import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { login, clearAuthError } from "../store/authSlice";
import ErrorMessage from "../components/ErrorMessage";

// Form di login controllato, con validazione.
export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, status, error } = useSelector((state) => state.auth);

  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  // Da dove volevo entrare prima di essere mandato al login (default: home).
  const from = location.state?.from?.pathname || "/";

  // Appena divento loggato, mi sposto dove volevo andare.
  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, navigate, from]);

  // Quando lascio la pagina pulisco un eventuale errore precedente (cleanup).
  useEffect(() => () => dispatch(clearAuthError()), [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const next = {};
    if (!values.email.trim()) {
      next.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      next.email = "Enter a valid email address"; // controllo formato email
    }
    if (!values.password) {
      next.password = "Password is required";
    }
    return next;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    dispatch(login(values)); // lancio il thunk di login
  };

  return (
    <Container className="my-5" style={{ maxWidth: 460 }}>
      <Card className="shadow-sm">
        <Card.Body>
          <h1 className="h4 mb-3 text-center">Login</h1>

          {/* Account demo per provare l'app velocemente */}
          <Alert variant="info" className="small">
            <strong>Demo accounts</strong>
            <br />
            Admin: admin@movies.com / admin123
            <br />
            User: user@movies.com / user123
          </Alert>

          {/* Errore dal server (es. password sbagliata) */}
          <ErrorMessage message={error} />

          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="email">
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

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              className="w-100"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Logging in..." : "Login"}
            </Button>
          </Form>

          <p className="text-center mt-3 mb-0">
            No account? <Link to="/register">Register</Link>
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
}
