const classService = require('../controllers/class/class.controller');
const router = require('express').Router();

router.route('/')
  .get(classService.getClasses)
  .post(classService.addClass);

router.route('/:id')
  .get(classService.getClassById)
  .put(classService.updateClass)
  .delete(classService.deleteClass);

module.exports = router;