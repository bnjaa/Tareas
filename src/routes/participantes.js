const express = require('express');
const router = express.Router();
const mysqlConexion  = require('../database.js');

const p_controller = require('../controllers/p_controller');

//router.get('/', p_controller.list);
router.get('/menu', p_controller.menu);
router.get('/participantes', p_controller.participantes);
router.get('/listar', p_controller.list);
router.get('/crear_p', p_controller.crear_p);
router.get('/crear_s', p_controller.crear_s);
router.get('/ver_consultas', p_controller.ver_consultas);
router.get('/volver', p_controller.volver);
router.get('/ver_boletos', p_controller.ver_boletos);
router.get('/borrar_boleto/:B_ID', p_controller.borrar_boleto);
router.post('/agregar_p', p_controller.agregar_p);
router.get('/borrar_p/:P_ID', p_controller.borrar_p);
router.get('/ver_ventas', p_controller.ver_ventas);
router.get('/borrar_venta/:V_ID', p_controller.borrar_venta);

// CONSULTAS
router.get('/ver_info_todos', p_controller.ver_info_todos);
router.get('/ver_ganadores', p_controller.ver_ganadores);
router.get('/ver_gastado_por_todos', p_controller.ver_gastado_por_todos);
router.get('/ver_total_de_ventas', p_controller.ver_total_de_ventas);
router.get('/ventas_via', p_controller.ventas_via);


module.exports = router;