import React, { useState } from "react";

const LoginPage = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("cajero"); // valor por defecto
  const [showPassword, setShowPassword] = useState(false);
 


  
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Usuario:", username);
    console.log("Contraseña:", password);
    console.log("Rol:", role);

    alert(`Bienvenido ${username} como ${role}`);

    // CAMBIE DE PANTALLA
    onLoginSuccess(role);
  };


  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f4f4f4",
        minHeight: "100vh",
        margin: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/*Encabezado*/}
      <header
        style={{
          backgroundColor: "#222",
          color: "#fff",
          padding: "15px 20px",
          fontSize: "1.5em",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        UrbanTrend
      </header>

      {/*Contenedor del login*/}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "35px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            width: "340px",
            textAlign: "center",
          }}
        >
          <h2 style={{ marginBottom: "20px", fontSize: "1.3em" }}>
            Iniciar Sesión
          </h2>

          <form onSubmit={handleSubmit}>
            {/*Usuario*/}
            <input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px",
                margin: "10px 0",
                border: "1px solid #ccc",
                borderRadius: "6px",
              }}
            />

            {/*Contraseña*/}
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  margin: "10px 0",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                }}
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  fontSize: "0.9em",
                  color: "#333",
                }}
              >
                {showPassword ? "Ocultar" : "Ver"}
              </span>
            </div>

            {/*Seleccion de roles*/}
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                margin: "10px 0",
                border: "1px solid #ccc",
                borderRadius: "6px",
                background: "#fff",
              }}
            >
              <option value="cajero">Cajero</option>
              <option value="admin">Administrador</option>
              <option value="almacenero">Almacenero</option>
              <option value="supervisor">Supervisor</option>
            </select>

            {/*button*/}
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#222",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "1em",
                marginTop: "10px",
                transition: "0.3s",
              }}
            >
              Entrar
            </button>

          </form>

          {/*recuperaxion de contraseña*/}
          <a
            href="#"
            style={{
              display: "block",
              marginTop: "15px",
              color: "#222",
              textDecoration: "none",
              fontSize: "0.9em",
            }}
          >
            ¿Olvidaste tu contraseña?
          </a>

          <div
            style={{
              marginTop: "20px",
              height: "1px",
              background: "#ddd",
              width: "100%",
            }}
          ></div>

          {/*Style*/}
          <p style={{ marginTop: "12px", fontSize: "0.75em", color: "#777" }}>
            © 2025 UrbanTrend. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

