import { Router } from "express";
const router = Router();

const {
    getList,
    createTodo,
    updateTodo,
    deleteTodo
}= require ('../controllers/todo');

router.route('/').get(getList).post(createTodo);
router.route('/:id').patch(updateTodo).delete(deleteTodo);

module.exports = router;