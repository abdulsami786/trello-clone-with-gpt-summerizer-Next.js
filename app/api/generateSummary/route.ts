import openai from "@/openai";
import { NextResponse } from "next/server";

export async function POST(request:Request){

    const {todos} = await request.json();
    console.log(todos);
    
    //communicate with openAi

    const response = await openai.chat.completions.create({
        model:'gpt-3.5-turbo',
        temperature:0.8,
        n:1,
        stream:false,
        messages:[
            {
                role:'system',
                content:'when responding welocme the user to the todo App. limit the response to 200 characters'
            },
            {
                role:'user',
                content:`Hi there provide the summary of following todos.COunt how many todos are there in each category such as To do, in progress and done,then tell the user to have a productive day.Here is the data: ${JSON.stringify(todos)}`,
            }
        ]
    })

    console.log(response.choices[0].message);
    return NextResponse.json(response.choices[0].message)
}