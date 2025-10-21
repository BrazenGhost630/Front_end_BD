import { useState } from 'react';
import InsertarPropietario from './page/propietario.jsx';
import InsertarCliente from './page/cliente.jsx';
import CargarPropiedadesPotenciales from './page/Cargar_propiedades_potenciales.jsx';
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
    ID_PROPIEDAD: '',
    NUMRUT_EMP: ''
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

        <InsertarPropietario />


        <InsertarCliente />


        <CargarPropiedadesPotenciales />

    </div>

    
  );
}

export default App;