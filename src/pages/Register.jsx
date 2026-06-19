import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Container, Card, Form, Button } from "react-bootstrap";
import { register, clearAuthError } from "../store/authSlice";
import ErrorMessage from "../components/ErrorMessage";

// Form di registrazione controllato, con validazione.
export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, status, error } = useSelector((state) => state.auth);

  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});

  // Dopo la registrazione (che fa anche login) vado alla home.
  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  // Pulisco l'errore quando lascio la pagina.
  useEffect(() => () => dispatch(clearAuthError()), [dispatch]);

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
    if (!values.password) {
      next.password = "Password is required";
    } else if (values.password.length < 6) {
      next.password = "Password must be at least 6 characters";
    }
    // la conferma deve coincidere con la password
    if (values.confirm !== values.password) {
      next.confirm = "Passwords do not match";
    }
    return next;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    // Non mando "confirm" al server: serviva solo al controllo.
    dispatch(
      register({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
      })
    );
  };

  return (
    <Container className="my-5" style={{ maxWidth: 460 }}>
      <Card className="shadow-sm">
        <Card.Body>
          <h1 className="h4 mb-3 text-center">Create an account</h1>

          {/* Errore dal server (es. email già esistente) */}
          <ErrorMessage message={error} />

          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="name">
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

            <Form.Group className="mb-3" controlId="reg-email">
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

            <Form.Group className="mb-3" controlId="reg-password">
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

            <Form.Group className="mb-3" controlId="confirm">
              <Form.Label>Confirm password</Form.Label>
              <Form.Control
                type="password"
                name="confirm"
                value={values.confirm}
                onChange={handleChange}
                isInvalid={!!errors.confirm}
              />
              <Form.Control.Feedback type="invalid">
                {errors.confirm}
              </Form.Control.Feedback>
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              className="w-100"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Creating..." : "Register"}
            </Button>
          </Form>

          <p className="text-center mt-3 mb-0">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
}
