const express = require('express');
const controller = require('../controllers/connectionController');
const {isLoggedIn, isAuthor} = require('../middlewares/auth')
const {validateId, validateTest} = require('../middlewares/validator')

const router = express.Router();

//GET /tests: send all tests to the user
router.get('/', controller.index);

//GET /test/newConnection: send html form for creating a new test
router.get('/newConnection', isLoggedIn, controller.new);

//POST /tests: create a new test
router.post('/', isLoggedIn, validateTest, controller.create);

//GET /tests/:id: send details of test identified by id
router.get('/:id', validateId, controller.show);

//GET /tests/:id/edit: send html form for editing an existing test
router.get('/:id/edit', validateId, isLoggedIn, isAuthor, controller.edit);

//PUT /tests/:id: update the test identified by id
router.put('/:id', validateId, isLoggedIn, isAuthor, validateTest, controller.update);

//DELETE /tests/:id: delete the test identified by id
router.delete('/:id', validateId, isLoggedIn, isAuthor, controller.delete);

module.exports = router;