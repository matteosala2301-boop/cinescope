import { Row, Col, Form } from "react-bootstrap";

// I generi disponibili nel menù a tendina.
const GENRES = ["Action", "Sci-Fi", "Drama", "Crime", "Animation"];

// Barra dei filtri della pagina Movies: ricerca, genere e ordinamento.
// È "controllata" dal genitore (Movies): riceve i valori e le funzioni per
// aggiornarli tramite props, non tiene stato suo.
export default function SearchFilters({
  search,
  genre,
  sort,
  onSearchChange,
  onGenreChange,
  onSortChange,
}) {
  return (
    <Row className="g-3 mb-4">
      <Col md={5}>
        {/* Campo di ricerca: a ogni tasto avviso il genitore con onSearchChange */}
        <Form.Control
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </Col>
      <Col md={4}>
        {/* Menù genere: opzione vuota = tutti i generi */}
        <Form.Select value={genre} onChange={(e) => onGenreChange(e.target.value)}>
          <option value="">All genres</option>
          {GENRES.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </Form.Select>
      </Col>
      <Col md={3}>
        {/* Menù ordinamento: i value (es. "rating_desc") vengono letti dal thunk */}
        <Form.Select value={sort} onChange={(e) => onSortChange(e.target.value)}>
          <option value="">Sort by...</option>
          <option value="rating_desc">Rating (high → low)</option>
          <option value="rating_asc">Rating (low → high)</option>
          <option value="year_desc">Year (newest)</option>
          <option value="year_asc">Year (oldest)</option>
          <option value="title_asc">Title (A → Z)</option>
        </Form.Select>
      </Col>
    </Row>
  );
}
