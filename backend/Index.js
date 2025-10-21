import express from 'express';
import oracledb from 'oracledb';
import cors from 'cors';
import dotenv from 'dotenv';

import 'dotenv/config'; 

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());


const PORT = 4000;

console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASS:', process.env.DB_PASS);
console.log('DB_HOST:', process.env.DB_HOST);


app.post('/insertar-propiedad', async (req, res) => {
  const {
    ENTREGA_PROPIEDAD,
    DIRECCION,
    SUPERFICIE,
    N_DORMITORIOS,
    N_BANIOS,
    VALOR_ARRIENDO,
    VALOR_GASTO,
    NUM_RUT_PROPIETARIO,
    ID_COMUNA,
    ID_PROPIEDAD,
    NUMRUT_EMP
  } = req.body;

  let connection;
  try {
    connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      connectString: process.env.DB_HOST
    });
    console.log("✅ Conexión exitosa a Oracle");

    await connection.execute(
      `BEGIN PKG_FELIX.PS_INSERCION_DE_PROPIEDAD(
     :entrega, :direccion, :superficie, :ndorm, :nbanos,
     :varriendo, :vgasto, :rutprop, :idcomuna, :idtipo, :NUMERO_EMP
   ); END;`,
      {
    entrega: ENTREGA_PROPIEDAD,
    direccion: DIRECCION,
    superficie: SUPERFICIE,
    ndorm: N_DORMITORIOS,
    nbanos: N_BANIOS,
    varriendo: VALOR_ARRIENDO,
    vgasto: VALOR_GASTO,
    rutprop: NUM_RUT_PROPIETARIO,
    idcomuna: ID_COMUNA,
    idtipo: ID_PROPIEDAD,
    NUMERO_EMP: NUMRUT_EMP
  },
      { autoCommit: true }
    );

    res.status(200).json({ message: 'Propiedad insertada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
});

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));







app.post('/api/propietarios', async (req, res) => {
  try {
    const connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      connectString: process.env.DB_HOST
    });

    const {
      numRut,
      dvRut,
      apPaterno,
      apMaterno,
      nombre,
      direccion,
      idEstCivil,
      fonoFijo,
      celular,
      idComuna
    } = req.body;

    await connection.execute(
      `BEGIN PKG_FELIX.PS_INSERCION_DE_PROPIETARIO(
        :numRut,
        :dvRut,
        :apPaterno,
        :apMaterno,
        :nombre,
        :direccion,
        :idEstCivil,
        :fonoFijo,
        :celular,
        :idComuna
      ); END;`,
      {
        numRut,
        dvRut,
        apPaterno,
        apMaterno,
        nombre,
        direccion,
        idEstCivil,
        fonoFijo,
        celular,
        idComuna
      }
    );

    await connection.commit();
    await connection.close();

    res.json({ message: 'Propietario insertado correctamente ✅' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al insertar propietario ❌', details: error.message });
  }
});





app.post("/api/clientes", async (req, res) => {
  const {
    numrut_cli,
    dvrut_cli,
    appaterno_cli,
    apmaterno_cli,
    nombre_cli,
    direccion_cli,
    id_estcivil,
    fonofijo_cli,
    celular_cli,
    renta_cli,
  } = req.body;

  try {
    await connection.execute(
      `BEGIN PKG_FELIX.PS_INSERCION_DE_CLIENTE(
        :numrut_cli,
        :dvrut_cli,
        :appaterno_cli,
        :apmaterno_cli,
        :nombre_cli,
        :direccion_cli,
        :id_estcivil,
        :fonofijo_cli,
        :celular_cli,
        :renta_cli
      ); END;`,
      {
        numrut_cli,
        dvrut_cli,
        appaterno_cli,
        apmaterno_cli,
        nombre_cli,
        direccion_cli,
        id_estcivil,
        fonofijo_cli,
        celular_cli,
        renta_cli,
      }
    );

    res.json({ message: "Cliente insertado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});



app.post('/api/cargar_propiedades_potenciales', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      connectString: process.env.DB_HOST,
    });

 
    await connection.execute(`BEGIN PKG_THAIS.cargar_propiedades_potenciales; END;`);
    await connection.commit();

    res.status(200).send('Procedimiento ejecutado correctamente');
  } catch (err) {
    console.error('Error ejecutando procedimiento:', err);
    res.status(500).send('Error al ejecutar el procedimiento: ' + err.message);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error cerrando conexión:', err);
      }
    }
  }
});
