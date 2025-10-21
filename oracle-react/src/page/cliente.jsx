import React, { useState } from "react";

export default function InsertarCliente() {
  const [form, setForm] = useState({
    numrut_cli: "",
    dvrut_cli: "",
    appaterno_cli: "",
    apmaterno_cli: "",
    nombre_cli: "",
    direccion_cli: "",
    id_estcivil: "",
    fonofijo_cli: "",
    celular_cli: "",
    renta_cli: "",
  });

  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje("✅ Cliente insertado correctamente.");
      } else {
        setMensaje(`❌ Error: ${data.error || "No se pudo insertar"}`);
      }
    } catch (error) {
      console.error("Error al insertar cliente:", error);
      setMensaje("⚠️ Error de conexión con el servidor.");
    }
  };

  return (
    <div style={{ padding: "20px", borderRadius: "12px" }}>
      <h1>Insertar Cliente</h1>
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
        <button >
          Insertar
        </button>
      </form>

      {mensaje && (
        <p style={{ marginTop: "15px", fontWeight: "bold" }}>{mensaje}</p>
      )}
    </div>
  );
}