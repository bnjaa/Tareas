const controller = {};
const mysqlConexion  = require('../database.js');

controller.list = (req, res) => {
    mysqlConexion.query('SELECT * FROM participantes', (err, rows) => {
        if (err) {
            res.json(err);
        }
        /*res.render('p', {
            data: rows
        });*/
        res.send(rows);
    });
}
controller.menu = (req, res) => {
    res.render('menu');
}
controller.participantes = (req, res) => {
    mysqlConexion.query('SELECT participantes.NOMBRE, participantes.EDAD, participantes.RUT, boletos.B_ID FROM participantes, boletos WHERE ', (err, rows) => {
        if (err) {
            res.json(err);
        }
        res.render('crear_p', {
            data: rows
        });
    });
}
controller.crear_s = (req, res) => {
    res.render('crear_s');
}
controller.crear_p = (req, res) => {
    mysqlConexion.query('SELECT * FROM participantes', (err, rows) => {
        if (err) {
            res.json(err);
        }
        res.render('crear_p', {
            data: rows
        });
    });
}
controller.ver_consultas = (req, res) => {
    res.render('ver_consultas');
}
controller.volver = (req, res) => {
    res.render('menu');
}
controller.agregar_p = (req, res) => {
    // SE AGREGA PARTICIPANTE
    const { Nombre, Edad, Rut, Genero, Region, Precio, Via } = req.body;
    mysqlConexion.query('INSERT INTO participantes SET?', {Nombre, Edad, Rut}, (err, rows) => {
        console.log("Se ha agregado a la tabla participantes");
    });
    // RELACION PARTICIPANTE GENERO
    mysqlConexion.query('INSERT INTO PARTICIPANTES_GENERO SELECT MAX(P_ID), G_ID FROM PARTICIPANTES, GENERO WHERE GENERO = ?', [Genero], (err, rows) => {
        console.log("Se ha agregado a la tabla genero");
    });
    // RELACION CON REGION
    mysqlConexion.query('INSERT INTO participantes_region SELECT MAX(P_ID), R_ID FROM participantes, region WHERE REGION = ?', [Region], (err, rows) => {
        console.log("Se ha agregado a la tabla region");
    });
    // INSERTAR BOLETO
    const nega = "NO";
    const query = `
        SET @Ganador = ?;
        CALL CREAR_BOLETO(@Ganador);
    `;
    mysqlConexion.query(query, [nega], (err, rows) => {
        console.log("Se ha creado un boleto");
    });
    // VINCULAR BOLETO CON ULTIMO SORTEO
    const query2 = `
        CALL CREAR_BOLETO();
    `;
    mysqlConexion.query(query2, (err, rows) => {
        console.log("Se ha vinculado boleto ultimo sorteo");
    });
    // CREAR VENTA
    const query3 = `
        SET @Precio = ?;
        CALL CREAR_VENTA(@Precio);
    `;
    mysqlConexion.query(query3, [Precio], (err, rows) => {
        console.log("Se ha creado una venta");
    });
    // VINCULAR BOLETO A LA VENTA
    const query4 = `
        CALL VENTA_BOLETO();
    `;
    mysqlConexion.query(query4, (err, rows) => {
        console.log("Se ha creado un venta_boleto");
    });
    // VINCULAR VENTA A PARTICIPANTE
    const query5 = `
        CALL VENTA_PARTICIPANTE();
    `;
    mysqlConexion.query(query5, (err, rows) => {
        console.log("Se ha creado una venta_boleto");
    });
    // VINCULAR VENTA CON VIA
    const query6 = `
        SET @Via = ?;
        CALL VENTA_VIA(@Via);
    `;
    mysqlConexion.query(query6, [Via], (err, rows) => {
        console.log("Se ha creado una venta_via");
    });
    /*
    // INSERTAR BOLETO
    const nega = "NO";
    mysqlConexion.query('INSERT INTO boletos SET?', [nega], (err, rows) => {
        console.log("Se ha agregado a la tabla boleto");
    });
    // VINCULAR BOLETO CON ULTIMO SORTEO
    mysqlConexion.query('INSERT INTO sorteos_boletos SELECT MAX(S_ID), MAX(B_ID) FROM sorteos, boletos', (err, rows) => {
        console.log("Se ha agregado a la relacion sorteo_boleto");
    });
    // CREAR VENTA
    mysqlConexion.query('INSERT INTO ventas SET?', [Precio], (err, rows) => {
        console.log("Se ha agregado a la tabla ventas");
    });
    // VINCULAR BOLETO A LA VENTA
    mysqlConexion.query('INSERT INTO ventas_boletos SELECT MAX(V_ID), MAX(B_ID) FROM ventas, boletos', (err, rows) => {
        console.log("Se ha agregado a la relacion venta_boleto");
    });
    // VINCULAR VENTA A PARTICIPANTE
    mysqlConexion.query('INSERT INTO ventas_participantes SELECT MAX(V_ID), MAX(P_ID) FROM ventas, participantes', (err, rows) => {
        console.log("Se ha agregado a la relacion venta_participante");
    });
    // VINCULAR VENTA CON VIA
    mysqlConexion.query('INSERT INTO ventas_via SELECT MAX(V_ID), VIA_ID FROM ventas, via WHERE VIA = ?', [Via], (err, rows) => {
        console.log("Se ha agregado a la relacion venta_via");
    });*/
    res.redirect('/crear_p');
    /*const query2 = `
        SET @GENERO = ?;
        CALL PARTICIPANTE_GENERO(@GENERO);
    `;
    mysqlConexion.query(query2, {Genero}, (err, rows) => {
        console.log("Se ha agregado a la tabla genero");
    });
    const query3 = `
        SET @REGION = ?;
        CALL PARTICIPANTE_REGION(@REGION);
    `;
    mysqlConexion.query(query3, {Region}, (err, rows) => {
        console.log("Se ha agregado a la tabla region");
        res.send('works');
    });*/
}
controller.borrar_p = (req, res) => {
    const { P_ID } = req.params;
    mysqlConexion.query('DELETE FROM participantes WHERE P_ID = ?', [P_ID], (err, rows) => {
        res.redirect('/crear_p');
    });
}
controller.ver_boletos = (req, res) => {
    mysqlConexion.query('SELECT boletos.B_ID, participantes.P_ID, boletos.GANADOR FROM boletos,ventas_boletos,ventas,ventas_participantes,participantes WHERE boletos.B_ID = ventas_boletos.B_ID AND ventas_boletos.V_ID = ventas.V_ID AND ventas_participantes.P_ID = participantes.P_ID AND ventas.V_ID = ventas_participantes.V_ID', (err, rows) => {
        if (err) {
            res.json(err);
        }
        res.render('ver_boletos', {
            data: rows
        });
    });
}
controller.borrar_boleto = (req, res) => {
    const { B_ID } = req.params;
    mysqlConexion.query('DELETE FROM boletos WHERE B_ID = ?', [B_ID], (err, rows) => {
        res.redirect('/ver_boletos');
    });

}
controller.ver_ventas = (req, res) => {
    mysqlConexion.query('SELECT ventas.V_ID,participantes.P_ID,ventas.PRECIO FROM ventas,ventas_participantes,participantes WHERE participantes.P_ID = ventas_participantes.P_ID AND ventas_participantes.V_ID = ventas.V_ID', (err, rows) => {
        if (err) {
            res.json(err);
        }
        res.render('ver_ventas', {
            data: rows
        });
    });
}
controller.borrar_venta = (req, res) => {
    const { V_ID } = req.params;
    mysqlConexion.query('DELETE FROM ventas WHERE V_ID = ?', [V_ID], (err, rows) => {
        res.redirect('/ver_ventas');
    });
}

// CONSULTAS
controller.ver_info_todos = (req, res) => {
    mysqlConexion.query('SELECT PARTICIPANTES.NOMBRE, PARTICIPANTES.EDAD, PARTICIPANTES.RUT, GENERO.GENERO, REGION.REGION FROM PARTICIPANTES, GENERO, REGION, participantes_genero, participantes_region WHERE PARTICIPANTES.P_ID = participantes_genero.P_ID AND PARTICIPANTES.P_ID = participantes_region.P_ID  AND GENERO.G_ID = participantes_genero.G_ID AND REGION.R_ID = participantes_region.R_ID GROUP BY Edad', (err, rows) => {
        if (err) {
            res.json(err);
        }
        res.render('ver_info_todos', {
            data: rows
        });
    });
}
controller.ver_ganadores = (req, res) => {
    const N = Math.round(Math.random()*(16-1)+parseInt(1));
    mysqlConexion.query('SELECT PARTICIPANTES.NOMBRE, PARTICIPANTES.EDAD, PARTICIPANTES.RUT, GENERO.GENERO, REGION.REGION FROM PARTICIPANTES, GENERO, REGION, participantes_genero, participantes_region,ventas_boletos,ventas,boletos,ventas_participantes WHERE PARTICIPANTES.P_ID = participantes_genero.P_ID AND PARTICIPANTES.P_ID = participantes_region.P_ID  AND GENERO.G_ID = participantes_genero.G_ID AND REGION.R_ID = participantes_region.R_ID AND participantes.P_ID = ventas_participantes.P_ID AND ventas.V_ID = ventas_boletos.V_ID AND boletos.B_ID = ventas_boletos.B_ID AND ventas.V_ID = ventas_participantes.V_ID AND boletos.B_ID = ?', [N], (err, rows) => {
        if(err){
		    res,json(err);
	    }
	    res.render('ver_ganadores', {
	        data: rows
	    });
    });
}
controller.ver_gastado_por_todos = (req, res) => {
    mysqlConexion.query('SELECT sum(ventas.PRECIO) as total, participantes.NOMBRE, participantes.P_ID FROM participantes,ventas,ventas_participantes WHERE participantes.P_ID = ventas_participantes.P_ID AND ventas.V_ID = ventas_participantes.V_ID GROUP BY participantes.P_ID', (err,rows) => {
        if(err){
            res,json(err);
        }
        res.render('ver_gastado_por_todos', {
            data: rows
        });
    });
}
controller.ver_total_de_ventas = (req, res) => {
    mysqlConexion.query('SELECT COUNT(ventas_participantes.V_ID) as total_ventas, PARTICIPANTES.NOMBRE, PARTICIPANTES.P_ID FROM VENTAS,PARTICIPANTES, ventas_participantes WHERE PARTICIPANTES.P_ID = ventas_participantes.P_ID AND ventas_participantes.V_ID = VENTAS.V_ID GROUP BY participantes.NOMBRE ORDER BY participantes.P_ID',(err,rows) => {
        if(err){
            res,json(err);
        }
        res.render('ver_total_de_ventas', {
            data: rows
        });
    });
}
controller.ventas_via = (req, res) => {
    mysqlConexion.query('SELECT COUNT(ventas_via.VIA_ID) as total, VIA.VIA FROM via,ventas_via WHERE via.VIA_ID = ventas_via.VIA_ID GROUP BY VIA.VIA',(err,rows) => {
        if(err){
            res,json(err);
        }
        res.render('ventas_via', {
            data: rows
        });
    });
}
// BORRAR TODO PARA NUEVO SORTEO
module.exports = controller;