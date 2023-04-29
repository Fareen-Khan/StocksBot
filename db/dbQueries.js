const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

async function create(serverID, name, userID){
  try{
    await prisma.DiscordTable.create({
      data:{
        name: name,
        server_id: serverID,
        author_id: userID,
      },
    })
    return {status:true}
  } catch(error){
    console.error(error);
    return{status:false, message:"Error Occured"}
  }
}

async function readAllData(serverID){
  try{
    const allData = await prisma.DiscordTable.findMany({
      where:{
        server_id: serverID,
      },
    })
    return allData;
  }catch(error){
    console.error(error)
  }
}

async function readUniqueData(authorID){
  try{
    const uniqueData = await prisma.DiscordTable.findMany({
      where:{
        author_id:authorID
      },
    })
    if(uniqueData != null){
      console.log("in db commands: "+uniqueData);
      return uniqueData;
    } 
    return false;
  }catch(error){
    console.error(error)
  }
}

async function deleteUniqueData(authorID, name){
  try{
    await prisma.DiscordTable.delete({
      where:{
        UniqueNameIdentifier: {
          author_id:authorID,
          name:name,
        }
      }
    })
  }catch(error){
    console.error(error)
  }
}

async function deleteAll(serverID){
  try {
    await prisma.DiscordTable.deleteMany({
      where:{
        server_id:serverID
      }
    })
    }catch (error) {
      console.error(error);
  }
}

module.exports = {create, deleteUniqueData, readAllData, readUniqueData, deleteAll};