import express from 'express';
import oracledb from 'oracledb';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = 4000;

// Ruta para ejecutar el procedimiento PL/SQL
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
    ID_PROPIEDAD
  } = req.body;

  let connection;
  try {
    connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      connectString: process.env.DB_HOST
    });

    await connection.execute(
      `
      BEGIN
        PKG_FELIX.PS_INSERCION_DE_PROPIEDAD(
          N_PROPIEDAD => NULL,
          ENTREGA_PROPIEDAD => TO_DATE(:ENTREGA_PROPIEDAD, 'YYYY-MM-DD'),
          DIRECCION => :DIRECCION,
          SUPERFICIE => :SUPERFICIE,
          N_DORMITORIOS => :N_DORMITORIOS,
          N_BANIOS => :N_BANIOS,
          VALOR_ARRIENDO => :VALOR_ARRIENDO,
          VALOR_GASTO => :VALOR_GASTO,
          NUM_RUT_PROPIETARIO => :NUM_RUT_PROPIETARIO,
          ID_COMUNA => :ID_COMUNA,
          ID_PROPIEDAD => :ID_PROPIEDAD
        );
      END;
      `,
      {
        ENTREGA_PROPIEDAD,
        DIRECCION,
        SUPERFICIE,
        N_DORMITORIOS,
        N_BANIOS,
        VALOR_ARRIENDO,
        VALOR_GASTO,
        NUM_RUT_PROPIETARIO,
        ID_COMUNA,
        ID_PROPIEDAD
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