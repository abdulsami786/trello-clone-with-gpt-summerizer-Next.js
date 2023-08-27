import { databases } from "@/appwrite";


export const getTodosGroupByColumn=async()=>{
    const data = await databases.listDocuments(
        process.env.NEXT_PUBLIC_DATABASE_ID!,
        process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!
    )
    console.log(data);
    const todos = data.documents;
    console.log(todos);

    const columns = todos.reduce((acc,todo)=>{
        if(!acc.get(todo.status)){
            acc.set(todo.status,{
                id:todo.status,
                todos:[]
            })
        }
        acc.get(todo.status)!.todos.push({
            $id:todo.$id,
            $createdAt:todo.$createdAt,
            title:todo.title,
            status:todo.status,
            ...(todo.image && {image:JSON.parse(todo.image)}),
        })
        return acc;
    },new Map<TypedColumn,Column>());
    console.log(columns);
    //if columns donot have inprogress,todo and done,add them with empty todos

    const columnTypes:TypedColumn[] = ['todo','inprogress','done'];
    for(const columnType of columnTypes){
        if(!columns.get(columnType)){
            columns.set(columnType,{
                id:columnType,
                todos:[],
            })
        }
    }
    console.log(columns);
    
    //sort column by cloumntypes
    console.log("Columns Enteries");
    
    console.log(columns.entries());
    console.log(Array.from(columns.entries()));
    
    
    const sortedColumns = new Map(
        Array.from(columns.entries()).sort(
            (a,b)=>columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0])
        )
    )
    const board:Board = {
        columns:sortedColumns
    }
    return board
}