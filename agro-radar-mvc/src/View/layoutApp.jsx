export function LayoutApp({ idioma = "en", onCambiarIdioma, textos = {}, children }) {
  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Poppins, sans-serif",
        minHeight: "88vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxSizing: "border-box",
      }}
    >
      <header style={{ textAlign: "center", marginBottom: "20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "8px",
            marginBottom: "12px",
          }}
        >
          <button
            type="button"
            onClick={() => onCambiarIdioma?.("es")}
            style={{
              ...botonIdioma,
              backgroundColor: idioma === "es" ? "#e8f5e9" : "#ffffff",
              borderColor: idioma === "es" ? "#2e7d32" : "#d0d7de",
              fontWeight: idioma === "es" ? "bold" : "normal",
            }}
          >
            <img
              src="https://flagcdn.com/w20/ar.png"
              alt="AR"
              style={{ width: "18px", height: "13px", borderRadius: "2px" }}
            />
            <span>Español</span>
          </button>

          <button
            type="button"
            onClick={() => onCambiarIdioma?.("en")}
            style={{
              ...botonIdioma,
              backgroundColor: idioma === "en" ? "#e3f2fd" : "#ffffff",
              borderColor: idioma === "en" ? "#1565c0" : "#d0d7de",
              fontWeight: idioma === "en" ? "bold" : "normal",
            }}
          >
            <img
              src="https://flagcdn.com/w20/us.png"
              alt="US"
              style={{ width: "18px", height: "13px", borderRadius: "2px" }}
            />
            <span>English</span>
          </button>
        </div>

        <h1
          style={{
            fontSize: "32px",
            margin: "0 0 6px",
            color: "#1b5e20",
            fontWeight: "800",
          }}
        >
          📡 Agro Radar
        </h1>
        <p style={{ margin: 0, fontSize: "14px", color: "#555" }}>
          {textos.subtituloApp || "Field Monitoring & Decision Assistant"}
        </p>
      </header>

      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {children}
      </main>

      <footer
        style={{
          marginTop: "28px",
          paddingTop: "14px",
          borderTop: "1px solid #e0e0e0",
          textAlign: "center",
          fontSize: "13px",
          color: "#555",
          lineHeight: 1.5,
        }}
      >
        <div style={{ fontWeight: "bold", color: "#222" }}>
          {textos.hechoPor || "Made by Team Three Stars ⭐⭐⭐"}
        </div>
        <div>
          Maximiliano Trejo • Nicolás Gauna • Cristian Enríquez • Máximo Varela
        </div>
      </footer>
    </div>
  );
}

export default LayoutApp;

const botonIdioma = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  padding: "6px 12px",
  fontSize: "13px",
  borderRadius: "20px",
  border: "1.5px solid #d0d7de",
  color: "#111",
  cursor: "pointer",
};