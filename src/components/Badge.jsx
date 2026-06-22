/**
 * Componente Badge para exibir categoria e prioridade
 * Responsabilidade: Apresentação visual de badges coloridos
 */
function Badge({ label, color }) {
  const badgeStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.25rem 0.5rem",
    borderRadius: "8px",
    fontSize: "0.75rem",
    fontWeight: "600",
    backgroundColor: color,
    color: "white",
    whiteSpace: "nowrap",
    lineHeight: "1",
  };

  return <span style={badgeStyle}>{label}</span>;
}

export default Badge;
