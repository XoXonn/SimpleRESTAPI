import express, {Request, Response} from 'express';
import {promises as fs} from 'fs';
import {v4 as uuidv4} from 'uuid';

const app = express ();
const PORT = 5001;
const DATABASE = './src/database/database.json'

app.use(express.json())


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

app.get('/list', async (req: Request,res: Response) => {
    try{
        const data:Data = await readDb();
        const {list} = data;
        res.status(200).json(list)
    } catch (error){
        res.status(404).json(error)
    }
})

. post('/list', async (req: Request,res: Response) => {
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
}) 

.patch ('/list/:id', async (req: Request, res:Response) => {
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
})

.delete ('/list/:id', async (req:Request, res:Response) => {
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
})



const start = () => {
    try{
        app.listen(PORT, ()=> console.log(`Listening on Port ${PORT}`))

    } catch (error) {
        console.log(error)
    };

}

start();