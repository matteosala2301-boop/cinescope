import { Pagination } from "react-bootstrap";

// Barra dei numeri di pagina. È "controllata" dal genitore: riceve la pagina
// corrente e il numero totale di pagine, e avvisa il genitore quando clicchi.
export default function PaginationBar({ page, totalPages, onPageChange }) {
  // Se c'è una sola pagina (o nessuna) non ha senso mostrare la barra.
  if (totalPages <= 1) return null;

  // Creo un array [1, 2, 3, ...] lungo quanto il numero di pagine.
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <Pagination className="justify-content-center mt-4">
      {/* "Precedente": disabilitato se sei già alla prima pagina */}
      <Pagination.Prev
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      />
      {pages.map((p) => (
        <Pagination.Item
          key={p}
          active={p === page} // evidenzio la pagina corrente
          onClick={() => onPageChange(p)}
        >
          {p}
        </Pagination.Item>
      ))}
      {/* "Successivo": disabilitato se sei all'ultima pagina */}
      <Pagination.Next
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      />
    </Pagination>
  );
}
