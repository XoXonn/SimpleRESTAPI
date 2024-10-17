import {Request, Response} from 'express';
import {promises as fs} from 'fs';
import { get } from 'http';
import {v4 as uuidv4} from 'uuid';

const DATABASE = './src/database/database.json'

interface List {
    id:string,
    todo:string
}

type Data = {
    list:List[]
}


async function readDb () {
    const data = await fs.readFile(DATABASE)
    const parse_data:Data = JSON.parse(data.toString());
    return parse_data
}

async function writeDb(data:Data) {
    fs.writeFile(DATABASE, JSON.stringify(data))
    
}

const getList = async (req: Request,res: Response) => {
    try{
        const data:Data = await readDb();
        const {list} = data;
        res.status(200).json(list)
    } catch (error){
        res.status(404).json(error)
    }
}

const createTodo = async (req: Request,res: Response) => {
    const {todo} = req.body;
    try{
        let data = await readDb();
        let {list} = data;

        let addTodo: List = {
            id: uuidv4(),
            todo: todo
        }

        list.push(addTodo)

        await writeDb(data)
        res.status(200).json(list)
    } catch (error) {
        res.status(404).json(error)
    }
}

const updateTodo = async (req: Request, res:Response) => {
    const {id} = req.params;
    const {todo} = req.body;
    try{
        let data = await readDb();
        let {list} = data;
        list = list.map((item) =>(item.id === id ? {id,todo} : item))
    
        data.list = list

        await writeDb(data)
        res.status(200).json(list)
    }
    catch (error){
        res.status(404).json(error)
    }
}

const deleteTodo = async (req:Request, res:Response) => {
    const {id} = req.params;
    try {
        let data = await readDb();
        let {list} = data;
        list = list.filter((item) => item.id !== id)
        
        data.list = list

        await writeDb(data);
        res.status(200).json(list);
    } catch (error){
        res.status(404).json(error)
    }
}

module.exports = {
    getList,
    createTodo,
    updateTodo,
    deleteTodo,
}