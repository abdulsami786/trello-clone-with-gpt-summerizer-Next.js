import {ID,storage} from "@/appwrite"

const uploadImage = async(file:File)=>{
    if(!file) return;

    const fileUploaded = await storage.createFile(
        '64dfcbb39472914628f1',
        ID.unique(),
        file
    )
    return fileUploaded;
}
export default uploadImage;