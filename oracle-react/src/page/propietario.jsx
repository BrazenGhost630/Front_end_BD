import React, { useState } from "react";

export default function InsertarPropietario() {
  const [form, setForm] = useState({
    numrut_prop: "",
    dvrut_prop: "",
    appaterno_prop: "",
    apmaterno_prop: "",
    nombre_prop: "",
    direccion_prop: "",
    id_estcivil: "",
    fonofijo_prop: "",
    celular_prop: "",
    id_comuna: ""
  });

  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/api/propietarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje("✅ Propietario insertado correctamente.");
      } else {
        setMensaje(`❌ Error: ${data.error || "No se pudo insertar"}`);
      }
    } catch (error) {
      console.error("Error al insertar propietario:", error);
      setMensaje("⚠️ Error de conexión con el servidor.");
    }
  };

  return (
    <div style={{ padding: "20px",  borderRadius: "12px" }}>
      <h1>Insertar Propietario</h1>
      <form onSubmit={handleSubmit}>
        {Object.keys(form).map((key) => (
          <div key={key} style={{ margin: "10px 0" }}>
            <label>{key}: </label>
            <input
              name={key}
              value={form[key]}
              onChange={handleChange}
              style={{ marginLeft: "8px", padding: "4px" }}
              required
            />
          </div>
        ))}
        <button> insertar propietario </button>
      </form>

      {mensaje && (
        <p style={{ marginTop: "15px", fontWeight: "bold" }}>{mensaje}</p>
      )}
    </div>
  );
}