

CREATE TABLE REPORTE_CLI_ESTCIVIL (
    ID_REPORTE            NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    DESC_ESTCIVIL         VARCHAR2(30),
    PORCENTAJE            NUMBER(5,2),
    RUT_CLIENTE           VARCHAR2(11),
    NOMBRE_COMPLETO       VARCHAR2(120),
    DESC_TIPO_PROPIEDAD   VARCHAR2(60),
    CANTIDAD_PROPIEDAD    NUMBER

);



CREATE TABLE PROP_POTENCIAL_ARRIENDO (
     NRO_PROPIEDAD NUMBER(6,0),
     DIRECCION_PROPIEDAD VARCHAR2(60),
     SUPERFICIE NUMBER(8,2),
     NRO_DORMITORIOS NUMBER(1,0),
     NRO_BANOS NUMBER(1,0),
     VALOR_ARRIENDO NUMBER(7,0),        
     VALOR_GASTO_COMUN NUMBER(6,0),
     PRECIO_SUBARRIENDO NUMBER(7,0),    
     NUMRUT_PROP NUMBER(10,0),
     NUMRUT_EMP NUMBER(10,0),
     FECHA_REGISTRO DATE DEFAULT SYSDATE);





CREATE OR REPLACE PACKAGE PKG_FELIX 

IS

PROCEDURE PS_INSERCION_DE_PROPIEDAD (
    ENTREGA_PROPIEDAD       DATE,
    DIRECCION               VARCHAR2,
    SUPERFICIE              NUMBER,
    N_DORMITORIOS           NUMBER,
    N_BANIOS                NUMBER,
    VALOR_ARRIENDO          NUMBER,
    VALOR_GASTO             NUMBER,
    NUM_RUT_PROPIETARIO     NUMBER,
    ID_COMUNA               NUMBER,
    ID_TIPO_PROPIEDAD       VARCHAR2,
    NUMRUT_EMP NUMBER
);


PROCEDURE PS_INSERCION_DE_CLIENTE (NUMRUT_CLI NUMBER,
DVRUT_CLI NUMBER,
APPATERNO_CLI VARCHAR2,
APMATERNO_CLI VARCHAR2,
NOMBRE_CLI VARCHAR2,
DIRECCION_CLI VARCHAR2,
ID_ESTCIVIL NUMBER,
FONOFIJO_CLI NUMBER,
CELULAR_CLI NUMBER,
RENTA_CLI NUMBER);


PROCEDURE PS_INSERCION_DE_PROPIETARIO (NUMRUT_PROP NUMBER,
    DVRUT_PROP NUMBER,
    APPATERNO_PROP VARCHAR2,
    APMATERNO_PROP VARCHAR2,
    NOMBRE_PROP VARCHAR2,
    DIRECCION_PROP VARCHAR2,
    ID_ESTCIVIL NUMBER,
    FONOFIJO_PROP NUMBER,
    CELULAR_PROP NUMBER,
    ID_COMUNA NUMBER
);





END PKG_FELIX;



CREATE OR REPLACE PACKAGE BODY PKG_FELIX

IS

PROCEDURE PS_INSERCION_DE_PROPIEDAD(
    ENTREGA_PROPIEDAD       DATE,
    DIRECCION               VARCHAR2,
    SUPERFICIE              NUMBER,
    N_DORMITORIOS           NUMBER,
    N_BANIOS                NUMBER,
    VALOR_ARRIENDO          NUMBER,
    VALOR_GASTO             NUMBER,
    NUM_RUT_PROPIETARIO     NUMBER,
    ID_COMUNA               NUMBER,
    ID_TIPO_PROPIEDAD       VARCHAR2,
    NUMRUT_EMP              NUMBER
)
IS
    V_MAYOR_ID NUMBER(10);
BEGIN
    SELECT NVL(MAX(NRO_PROPIEDAD), 0) + 1
    INTO V_MAYOR_ID
    FROM PROPIEDAD;

    INSERT INTO PROPIEDAD (
        NRO_PROPIEDAD,
        FECHA_ENTREGA_PROPIEDAD,
        DIRECCION_PROPIEDAD,
        SUPERFICIE,
        NRO_DORMITORIOS,
        NRO_BANOS,
        VALOR_ARRIENDO,
        VALOR_GASTO_COMUN,
        NUMRUT_PROP,
        ID_COMUNA,
        ID_TIPO_PROPIEDAD,
        NUMRUT_EMP
    )
    VALUES (
        V_MAYOR_ID,
        ENTREGA_PROPIEDAD,
        DIRECCION,
        SUPERFICIE,
        N_DORMITORIOS,
        N_BANIOS,
        VALOR_ARRIENDO,
        VALOR_GASTO,
        NUM_RUT_PROPIETARIO,
        ID_COMUNA,
        ID_TIPO_PROPIEDAD,
      
        NUMRUT_EMP
    );

    COMMIT;
END PS_INSERCION_DE_PROPIEDAD;
    
    
    
    
    PROCEDURE PS_INSERCION_DE_CLIENTE (NUMRUT_CLI NUMBER,
            DVRUT_CLI NUMBER,
            APPATERNO_CLI VARCHAR2,
            APMATERNO_CLI VARCHAR2,
            NOMBRE_CLI VARCHAR2,
            DIRECCION_CLI VARCHAR2,
            ID_ESTCIVIL NUMBER,
            FONOFIJO_CLI NUMBER,
            CELULAR_CLI NUMBER,
            RENTA_CLI NUMBER) 

        IS
        BEGIN
        INSERT INTO CLIENTE VALUES (NUMRUT_CLI,
            DVRUT_CLI ,
            APPATERNO_CLI ,
            APMATERNO_CLI ,
            NOMBRE_CLI ,
            DIRECCION_CLI ,
            ID_ESTCIVIL ,
            FONOFIJO_CLI ,
            CELULAR_CLI ,
            RENTA_CLI );
            COMMIT;
        END PS_INSERCION_DE_CLIENTE;
        
        
        
        PROCEDURE PS_INSERCION_DE_PROPIETARIO (NUMRUT_PROP NUMBER,
        DVRUT_PROP NUMBER,
        APPATERNO_PROP VARCHAR2,
        APMATERNO_PROP VARCHAR2,
        NOMBRE_PROP VARCHAR2,
        DIRECCION_PROP VARCHAR2,
        ID_ESTCIVIL NUMBER,
        FONOFIJO_PROP NUMBER,
        CELULAR_PROP NUMBER,
        ID_COMUNA NUMBER
        ) 
        IS 
        
        BEGIN 
            INSERT INTO PROPIETARIO
            VALUES
            (NUMRUT_PROP ,
            DVRUT_PROP ,
            APPATERNO_PROP ,
            APMATERNO_PROP ,
            NOMBRE_PROP ,
            DIRECCION_PROP ,
            ID_ESTCIVIL ,
            FONOFIJO_PROP ,
            CELULAR_PROP ,
            ID_COMUNA );
            
            COMMIT;
    
    
    END PS_INSERCION_DE_PROPIETARIO;
        
        
        
        
 END PKG_FELIX;
 
 
 
 
 
 
 
 
 
 
 
 
 
 CREATE OR REPLACE PACKAGE PKG_THAIS 

IS  

FUNCTION calcular_subarriendo(p_valor_arriendo NUMBER,p_valor_gasto_comun NUMBER) RETURN NUMBER;


PROCEDURE cargar_propiedades_potenciales;




END PKG_THAIS;


CREATE OR REPLACE PACKAGE BODY PKG_THAIS 

IS

FUNCTION calcular_subarriendo(p_valor_arriendo NUMBER,p_valor_gasto_comun NUMBER)
    RETURN NUMBER
    IS
        v_margen NUMBER := 0.2;
    BEGIN
        RETURN(((p_valor_arriendo * 0.8)+ p_valor_gasto_comun)*(1+v_margen));
    END calcular_subarriendo;
    
    
    
    
    PROCEDURE cargar_propiedades_potenciales IS
    CURSOR cur_propiedades IS
        SELECT NRO_PROPIEDAD npropiedad,
               FECHA_ENTREGA_PROPIEDAD fepropiedad,
               DIRECCION_PROPIEDAD direct,
               SUPERFICIE superf,
               NRO_DORMITORIOS ndormitorios,
               NRO_BANOS nbanos,
               VALOR_ARRIENDO varriendo,
               NVL(VALOR_GASTO_COMUN, 0) vgcomun,
               ID_TIPO_PROPIEDAD tipopropiedad,
               ID_COMUNA comuna,
               NUMRUT_PROP rutpropietario,
               NUMRUT_EMP rutemp
        FROM PROPIEDAD;
BEGIN
    FOR reg_propiedades IN cur_propiedades LOOP
        DECLARE
            v_disponible BOOLEAN := TRUE;
            v_precio_subarriendo NUMBER;
            v_valor_arriendo NUMBER;
            v_valor_gasto_comun NUMBER;
        BEGIN
        
            EXECUTE IMMEDIATE 'TRUNCATE TABLE PROP_POTENCIAL_ARRIENDO';
            
            v_valor_arriendo := reg_propiedades.varriendo;
            v_valor_gasto_comun := reg_propiedades.vgcomun;

            
            FOR arrendado IN (
                SELECT *
                FROM PROPIEDAD_ARRENDADA
                WHERE NRO_PROPIEDAD = reg_propiedades.npropiedad
            ) LOOP
                IF arrendado.FECTER_ARRIENDO IS NULL
                   OR SYSDATE BETWEEN arrendado.FECINI_ARRIENDO AND arrendado.FECTER_ARRIENDO THEN
                    v_disponible := FALSE;
                    EXIT;
                END IF;
            END LOOP;

            
            IF reg_propiedades.superf >= 50 AND v_disponible THEN
                
                v_precio_subarriendo := PKG_THAIS.calcular_subarriendo(v_valor_arriendo, v_valor_gasto_comun);

                INSERT INTO PROP_POTENCIAL_ARRIENDO (
                    NRO_PROPIEDAD, DIRECCION_PROPIEDAD, SUPERFICIE, NRO_DORMITORIOS, NRO_BANOS,
                    VALOR_ARRIENDO, VALOR_GASTO_COMUN, PRECIO_SUBARRIENDO, NUMRUT_PROP, NUMRUT_EMP
                ) VALUES (
                    reg_propiedades.npropiedad, reg_propiedades.direct, reg_propiedades.superf,
                    reg_propiedades.ndormitorios, reg_propiedades.nbanos,
                    v_valor_arriendo, v_valor_gasto_comun, v_precio_subarriendo,
                    reg_propiedades.rutpropietario, reg_propiedades.rutemp
                );

            END IF;      
        END;
    END LOOP;
    COMMIT;
END cargar_propiedades_potenciales;
    
    
    


END PKG_THAIS;
 
 
 
 
CREATE OR REPLACE PACKAGE PKG_GISLAINE 
IS 

FUNCTION fn_porcentaje_estcivil(p_desc_estcivil VARCHAR2)  RETURN NUMBER;

PROCEDURE sp_generar_reporte_estcivil(p_desc_estcivil VARCHAR2);



END PKG_GISLAINE;




CREATE OR REPLACE PACKAGE BODY PKG_GISLAINE 
IS 


FUNCTION fn_porcentaje_estcivil(p_desc_estcivil VARCHAR2)
RETURN NUMBER
    IS
        v_total    NUMBER;
        v_estado   NUMBER;
        v_porc  NUMBER;
    BEGIN
        SELECT COUNT(DISTINCT numrut_cli) 
        INTO v_total 
        FROM propiedad_arrendada;
        
        SELECT COUNT(DISTINCT pa.numrut_cli)
        INTO v_estado
        FROM propiedad_arrendada pa
        WHERE pa.numrut_cli IN (
                SELECT numrut_cli
                FROM cliente
                WHERE id_estcivil = (
                        SELECT id_estcivil
                        FROM estado_civil
                        WHERE UPPER(desc_estcivil) = UPPER(p_desc_estcivil)
    )
);

        IF NVL(v_total,0) = 0 THEN
            RETURN 0;
        ELSE
            v_porc := ROUND((v_estado / v_total) * 100,2);
                RETURN v_porc;
        END IF;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN 0;
END fn_porcentaje_estcivil;



PROCEDURE sp_generar_reporte_estcivil(p_desc_estcivil VARCHAR2)
IS
    v_porcentaje NUMBER;
BEGIN
    v_porcentaje := fn_porcentaje_estcivil(p_desc_estcivil);
    
    EXECUTE IMMEDIATE 'TRUNCATE TABLE REPORTE_CLI_ESTCIVIL';

    INSERT INTO REPORTE_CLI_ESTCIVIL(
        DESC_ESTCIVIL, 
        PORCENTAJE, 
        RUT_CLIENTE,
        NOMBRE_COMPLETO,
        DESC_TIPO_PROPIEDAD, 
        CANTIDAD_PROPIEDAD
    )
    SELECT
        p_desc_estcivil,
        v_porcentaje,
        c.numrut_cli || '-' || c.dvrut_cli,
        c.nombre_cli || ' ' || c.appaterno_cli || ' ' || c.apmaterno_cli,
        tp.desc_tipo_propiedad,
        COUNT(*) AS cantidad_propiedad
        FROM cliente c
            JOIN propiedad_arrendada pa ON pa.numrut_cli = c.numrut_cli
            JOIN propiedad p ON p.nro_propiedad = pa.nro_propiedad
            JOIN tipo_propiedad tp ON tp.id_tipo_propiedad = p.id_tipo_propiedad
        WHERE c.id_estcivil = (
                SELECT id_estcivil 
                FROM estado_civil
            WHERE UPPER(desc_estcivil)=UPPER(p_desc_estcivil)
    )
    GROUP BY 
        c.numrut_cli, c.dvrut_cli,
        c.nombre_cli, c.appaterno_cli, c.apmaterno_cli,
        tp.desc_tipo_propiedad;


    
    
    
    
END sp_generar_reporte_estcivil;

END PKG_GISLAINE;


CREATE OR REPLACE TRIGGER trg_auto_reporte_estcivil
AFTER INSERT ON propiedad_arrendada
FOR EACH ROW
    DECLARE
        v_desc_estcivil VARCHAR2(30);
    BEGIN
        SELECT ec.desc_estcivil
        INTO v_desc_estcivil
        FROM cliente c
        JOIN estado_civil ec ON ec.id_estcivil = c.id_estcivil
        WHERE c.numrut_cli = :NEW.numrut_cli;

    PKG_GISLAINE.sp_generar_reporte_estcivil(v_desc_estcivil);
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        NULL;
END trg_auto_reporte_estcivil;
 
 
 
 
 


