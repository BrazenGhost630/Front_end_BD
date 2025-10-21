import React, { useState } from 'react';
import axios from 'axios';

function CargarPropiedadesPotenciales() {
  const [mensaje, setMensaje] = useState('');

  async function handleClick() {
    try {
      const res = await axios.post('http://localhost:4000/api/cargar_propiedades_potenciales');
      setMensaje(res.data);
    } catch (err) {
      setMensaje('Error al ejecutar: ' + err.message);
    }
    
  }

  return (
    <div style={{ margin: '20px' }}>
      <h1>Cargar Propiedades Potenciales</h1>
      <button onClick={handleClick}>Ejecutar procedimiento</button>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

export default CargarPropiedadesPotenciales;