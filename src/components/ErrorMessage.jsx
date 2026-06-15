/**
 * Componente para exibir mensagens de erro
 * Responsabilidade única: apresentação de erros
 */
function ErrorMessage({ message, onRetry }) {
  if (!message) return null;

  return (
    <div style={{ 
      padding: "1rem", 
      backgroundColor: "#fee", 
      color: "#c00",
      borderRadius: "4px",
      marginBottom: "1rem"
    }}>
      <strong>Erro:</strong> {message}
      {onRetry && (
        <button 
          onClick={onRetry}
          style={{ marginLeft: "1rem" }}
        >
          Tentar novamente
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
