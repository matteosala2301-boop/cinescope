// Mostra una valutazione a stelle (1-5). Componente furbo e riutilizzabile:
// - senza onChange → sola lettura (es. mostrare il voto di una recensione)
// - con onChange → interattivo (clicchi le stelle, es. dentro il form recensione)
export default function RatingStars({ value = 0, onChange = null, size = "1.5rem" }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div style={{ fontSize: size, lineHeight: 1 }}>
      {stars.map((star) => {
        const filled = star <= value; // questa stella è "piena"?
        return (
          <span
            key={star}
            // diventa cliccabile solo se mi hanno passato onChange
            role={onChange ? "button" : undefined}
            onClick={onChange ? () => onChange(star) : undefined}
            style={{
              color: filled ? "#ffc107" : "#d0d0d0", // oro se piena, grigio se vuota
              cursor: onChange ? "pointer" : "default",
              marginRight: 2,
            }}
            aria-label={`${star} star`}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}
