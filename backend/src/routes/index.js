const {Router} = require('express');
const router= Router();

const cassandra = require('cassandra-driver');

var cliente = new cassandra.Client({contactPoints: ['127.0.0.1'],localDataCenter: 'datacenter1',keyspace: 'ProyectoBD2_201701048'});

router.get('/', (req, res)=>{
    res.send('<h1>Welcome!</h2>');  //send envía un string
});

/**Reporte 1: Operaciones realizadas por un cuentahabiente*/
router.put('/op-client', (req, res)=>{
    const { nombre_1, apellido_1, cui_1 } = req.body;  
   const query=`select * from operaciones_by_cuentahabiente where nombre_1 = \'${nombre_1}\' AND apellido_1 = \'${apellido_1}\' and cui_1 = ${cui_1}`;
    cliente.execute(query)
    .then(result => {res.status(200).json(result.rows)})
    .catch(reason => res.status(500).json(reason));
});


//INSERT Operacion 
/** Se debe de agregar lo siguiente:
 * 
 * Validar que el saldo de 1 sea mayor o igual al monto a retirar
 * Si tiene suficiente dinero:
 *          - Agregar registro en operaciones_by_cuentahabiente
 *          - Modificar CuentahabientesPorInstitucion para 1 y para 2, con el resultado del débito/credito
 *          - Agrego el registro en la tabla de debitos
 *          - Agrego el registro en la tabla de creditos
 * Si no tiene suficiente dinero:
 *          - Agregamos el registro de la falla --> ya
 *  */ 
router.post('/op-client', (req, res)=>{
    const { nombre_1, apellido_1, cui_1, InstitucionBancaria_1, tipoCuenta_1, saldoinicial_1, nombre_2, apellido_2, cui_2,
        InstitucionBancaria_2, tipoCuenta_2, saldoinicial_2,montotransferencia, fechatransferencia, mes, anio, fechaRegistro_1, fechaRegistro_2 } = req.body; 
    if(saldoinicial_1 >=montotransferencia){
        //quiere decir que tiene suficiente money
        const query=`INSERT INTO operaciones_by_cuentahabiente(nombre_1, apellido_1, cui_1, InstitucionBancaria_1, tipoCuenta_1, saldoinicial_1, nombre_2, apellido_2, cui_2, InstitucionBancaria_2, tipoCuenta_2, saldoinicial_2,montotransferencia, fechatransferencia, mes, anio) 
        VALUES (\'${nombre_1}\', \'${apellido_1}\', ${cui_1}, \'${InstitucionBancaria_1}\', \'${tipoCuenta_1}\', ${saldoinicial_1},
            \'${nombre_2}\', \'${apellido_2}\', ${cui_2}, \'${InstitucionBancaria_2}\', \'${tipoCuenta_2}\', ${saldoinicial_2}, ${montotransferencia}, \'${fechatransferencia}\', ${mes}, ${anio});`;
        cliente.execute(query)
        .then(result => {
            //res.status(200).json({'result:':result});
            console.log('operaciones_by_cuentahabiente --> correcto');
        })
        .catch(reason => res.status(500).json({'result':reason}));


        //Ahora modificamos CuentahabientesPorInstitucion
        let op_debito=saldoinicial_1-montotransferencia;
        const query_debito=`UPDATE cuentahabientesporinstitucion SET saldoinicial = ${op_debito}  where institucionbancaria= \'${InstitucionBancaria_1}\'  and cui=${cui_1} and tipocuenta=\'${tipoCuenta_1}\' and fecharegistro=\'${fechaRegistro_1}\' ;`
        cliente.execute(query_debito)
        .then(result_debito =>{
            //aqui vamos a mandar a modificar CuentahabientesPorInstitucion del acreditado
            console.log('update saldo de debitado --> correcto')
        })
        .catch(reason_debito => res.status(500).json({'result':reason_debito}));

        let op_credito=saldoinicial_2+montotransferencia;
        const query_credito=`UPDATE cuentahabientesporinstitucion SET saldoinicial = ${op_credito}  where institucionbancaria= \'${InstitucionBancaria_2}\'  and cui=${cui_2} and tipocuenta=\'${tipoCuenta_2}\' and fecharegistro=\'${fechaRegistro_2}\' ;`
        cliente.execute(query_credito)
        .then(result_credito => {
            console.log("update salto de debitado --> correcto");
        })
        .catch(reason => res.status(500).json({'result':reason}));

        //res.status(200).json({'result':result_credito});
        //Ahora aqui agrego el registro a totales_debitos y a totales_creditos
        const query_totales_debitos=`INSERT INTO totales_debitos(InstitucionBancaria_debito,montotransferencia,fechatransferencia) VALUES (\'${InstitucionBancaria_1}\', ${montotransferencia}, \'${fechatransferencia}\');`
        cliente.execute(query_totales_debitos)
        .then(result => {console.log("insert totales debitos --> correcto")})
        .catch(reason => res.status(500).json({'result':reason}));

        const query_totales_creditos=`INSERT INTO totales_creditos(InstitucionBancaria_credito,montotransferencia,fechatransferencia) VALUES (\'${InstitucionBancaria_2}\', ${montotransferencia}, \'${fechatransferencia}\');`
        cliente.execute(query_totales_creditos)
        .then(result => {console.log("insert totales creditos --> correcto"); res.status(200).json({'result':result});})
        .catch(reason => res.status(500).json({'result':reason}));
    }else{
        //quiere decir que no tiene suficiente money
        const query=`INSERT INTO falla(cui, InstitucionBancaria, tipoCuenta, descripcion, fecha) values (${cui_1}, \'${InstitucionBancaria_1}\', \'${tipoCuenta_1}\', \'La cuenta a debitar no tiene suficientes fondos. \', ${new Date()})` ;
        console.log(query);
        res.status(500).json({'result':"La cuenta a debitar no tiene suficientes fondos para el retiro."});
    }
   
});




/**Reporte 2: Totales de créditos y débitos para una institucion financiera*/
router.get('/credit-debit', (req, res)=>{
    const { institucionbancaria } = req.body;  
   const query=`select SUM(montotransferencia) as Total_Debitos from totales_debitos where institucionbancaria_debito= \'${institucionbancaria}\'`;
    cliente.execute(query)
    .then(result => {
        const query_creditos=`select SUM(montotransferencia) as Total_Creditos from totales_creditos where institucionbancaria_credito= \'${institucionbancaria}\'`;
        cliente.execute(query_creditos)
        .then(result_creditos => {
            res.status(200).json({'total_debitos:':result.first().total_debitos, 'total_creditos':result_creditos.first().total_creditos})
        })
        .catch(reason => res.status(500).json({'result':reason}));
    })
    .catch(reason => res.status(500).json({'result':reason}));
});


/**Reporte 3: Cuentahabientes*/
router.get('/clients', (req, res)=>{
   const query=`select * from CuentahabientesPorInstitucion;`;
    cliente.execute(query)
    .then(result => {res.status(200).json({'result:':result.rows})})
    .catch(reason => res.status(500).json({'result':reason}));
});

/**Reporte 4: Instituciones bancarias*/
router.get('/bancos', (req, res)=>{
    const query=`select institucionbancaria, abreviacioninst from CuentahabientesPorInstitucion group by institucionbancaria;`;
     cliente.execute(query)
     .then(result => {res.status(200).json({'result:':result.rows})})
     .catch(reason => res.status(500).json({'result':reason}));
 });

 //INSERT
 router.post('/bancos', (req, res)=>{
    const { nombre, apellido, CUI, email, fecharegistro, genero, institucionbancaria,abreviacioninst,tipocuenta, saldoInicial } = req.body;  
   const query=`INSERT INTO CuentahabientesPorInstitucion(nombre, apellido, CUI, email, fecharegistro, genero, institucionbancaria,abreviacioninst,tipocuenta, saldoInicial) VALUES (\'${nombre}\', \'${apellido}\', ${CUI}, \'${email}\', \'${fecharegistro}\', \'${genero}\', \'${institucionbancaria}\', \'${abreviacioninst}\', \'${tipocuenta}\', ${saldoInicial});`;
   cliente.execute(query)
    .then(result => {res.status(200).json({'result:':result})})
    .catch(reason => res.status(500).json({'result':reason}));
});

/**Reporte 5: Movimientos por cuentahabiente por mes*/

router.get('/moves', (req, res)=>{
    const { nombre_1, apellido_1, cui_1, mes, anio } = req.body;  
   const query=`select * from operaciones_by_cuentahabiente where nombre_1 = \'${nombre_1}\' AND apellido_1 = \'${apellido_1}\' and cui_1 = ${cui_1} and  mes = ${mes} and anio = ${anio}`;
    cliente.execute(query)
    .then(result => {res.status(200).json({'result:':result.rows})})
    .catch(reason => res.status(500).json({'result':reason}));
});


module.exports=router; //con esto exportamos el elemento