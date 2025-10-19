import { useState } from 'react';

function App() {
  const [form, setForm] = useState({
    ENTREGA_PROPIEDAD: '',
    DIRECCION: '',
    SUPERFICIE: '',
    N_DORMITORIOS: '',
    N_BANIOS: '',
    VALOR_ARRIENDO: '',
    VALOR_GASTO: '',
    NUM_RUT_PROPIETARIO: '',
    ID_COMUNA: '',
    ID_PROPIEDAD: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:4000/insertar-propiedad', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    alert(data.message || data.error);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Insertar Propiedad</h1>
      <form onSubmit={handleSubmit}>
        {Object.keys(form).map((key) => (
          <div key={key} style={{ margin: '10px 0' }}>
            <label>{key}: </label>
            <input name={key} value={form[key]} onChange={handleChange} />
          </div>
        ))}
        <button type="submit">Insertar</button>
      </form>
    </div>
  );
}

export default App;