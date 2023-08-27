'use client'
import { useBoardStore } from '@/store/BoardStore';
import { FC, useEffect } from 'react'
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd';
import Column from './Column';
interface BoardProps {
  
}


const Board: FC<BoardProps> = ({}) => {
    const [board,getBoard,setBoardState,updateTodoInDB] = useBoardStore((state)=>[state.board,state.getBoard,state.setBoardState,state.updateTodoInDB]);
    useEffect(()=>{
        getBoard();

    },[getBoard]);
    console.log(board);
    const handleOnDragEnd = (result:DropResult)=>{
        const {destination,source,type}=result;
        console.log(destination);
        console.log(source);
        console.log(type);
        console.log("result",result);
        
        if(!destination) return;

        if(type === 'column'){
            const entries = Array.from(board.columns.entries());
            console.log("entries",entries);
            
            const [removed] = entries.splice(source.index,1);
            console.log("removed",removed);
            
            entries.splice(destination.index,0,removed);
            const rearrangedColumn = new Map(entries);
            setBoardState({
                ...board,
                columns:rearrangedColumn
            })
        }
        
        // This step is needed as the indexes are stored as numbers 0,1,2,3 etc.instead of ids with DND library

        const columns =  Array.from(board.columns);
        const startColIndex = columns[Number(source.droppableId)];
        const finishColIndex = columns[Number(destination.droppableId)];
        console.log("Start Col Index",startColIndex);
        console.log("finish col index",finishColIndex);
        
        const startCol: Column={
            id:startColIndex[0],
            todos:startColIndex[1].todos,
        }

        const finishCol:Column={
            id:finishColIndex[0],
            todos:finishColIndex[1].todos
        }
        console.log(`startCol ${startCol} finishCol ${finishCol}`);

        if(!startCol || !finishCol) return;
        
        //if I drag and drop at the same position then do nothing
        if(source.index === destination.index && startCol === finishCol)return;
        
        const newTodos = startCol.todos;
        const [todoMoved] = newTodos.splice(source.index,1);

        if(startCol.id === finishCol.id){
            // same column drag and drop
            newTodos.splice(destination.index,0,todoMoved);
            const newCol = {
                id:startCol.id,
                todos:newTodos
            }

            const newColumns = new Map(board.columns);
            newColumns.set(startCol.id,newCol);

            setBoardState({...board,columns:newColumns})
        }else{
            //dragging to another column

            const finishTodos  = Array.from(finishCol.todos);
            finishTodos.splice(destination.index,0,todoMoved);

            const newColumns = new Map(board.columns);
            const newCol = {
                id:startCol.id,
                todos:newTodos
            }
            newColumns.set(startCol.id,newCol);
            newColumns.set(finishCol.id,{
                id:finishCol.id,
                todos:finishTodos
            })
            // updating in db
            updateTodoInDB(todoMoved,finishCol.id);
            setBoardState({...board,columns:newColumns})
        }
    }
  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId='board' direction='horizontal' type='column'>
            {(provided)=>(
                <div className='grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto'
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    >
                        {Array.from(board.columns.entries()).map(([id,column],index)=>(
                            <Column key={id} id={id} todos={column.todos} index={index}/>
                        ))}
                </div>
            )

            }
        </Droppable>
    </DragDropContext>
  )
}

export default Board