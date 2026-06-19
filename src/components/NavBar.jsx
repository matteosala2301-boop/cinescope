import { Navbar, Nav, Container, Button, Badge } from "react-bootstrap";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";

// Barra di navigazione in alto. Mostra link diversi a seconda di:
// se sei loggato e di che ruolo hai (rendering condizionale).
export default function NavBar() {
  const user = useSelector((state) => state.auth.user); // l'utente loggato (o null)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Logout: svuoto l'utente nello store e torno alla home.
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        {/* Il logo riporta sempre alla home */}
        <Navbar.Brand as={Link} to="/">
          🎬 CineScope
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" end>
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/movies">
              Movies
            </Nav.Link>
            {/* Il link Dashboard appare SOLO se sei admin */}
            {user?.role === "admin" && (
              <Nav.Link as={NavLink} to="/dashboard">
                Dashboard
              </Nav.Link>
            )}
          </Nav>

          <Nav className="align-items-lg-center">
            {/* Se sei loggato → nome + badge ruolo + Logout; altrimenti → Login/Register */}
            {user ? (
              <>
                <Nav.Link as={NavLink} to="/profile">
                  {user.name}{" "}
                  <Badge bg={user.role === "admin" ? "warning" : "info"}>
                    {user.role}
                  </Badge>
                </Nav.Link>
                <Button
                  variant="outline-light"
                  size="sm"
                  className="ms-lg-2 mt-2 mt-lg-0"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={NavLink} to="/register">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
