/**
 * Componente de carregamento
 * Responsabilidade única: feedback de loading
 */
function LoadingSpinner({ message = "Carregando..." }) {
  return (
    <div style={{ 
      textAlign: "center", 
      padding: "2rem",
      color: "#666"
    }}>
      <p>{message}</p>
    </div>
  );
}

export default LoadingSpinner;
