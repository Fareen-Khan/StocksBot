const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

async function create(serverID, name, link, userID){
  try{
    await prisma.DiscordTable.create({
      data:{
        name: name,
        server_id: serverID,
        author_id: userID,
        link: link,
      },
    })
    return {staus:true}
  } catch(error){
    console.error(error);
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

async function readUniqueData(serverID, name){
  try{
    const uniqueData = await prisma.DiscordTable.findUnique({
      where:{
        UniqueNameIdentifier: {
          server_id: serverID,
          name:name,
        }
      },
    })
    if(uniqueData != null){
      return uniqueData.link;
    } 
    return false;
  }catch(error){
    console.error(error)
  }
}

async function updateDataName(serverID, name, newName){
  try{
    await prisma.DiscordTable.update({
      where:{
        UniqueNameIdentifier: {
          server_id: serverID,
          name:name,
        }
      },
      data:{
        name:newName
      }
      })
    }catch(error){
    console.error(error);
  }
}

async function updateDataLink(serverID, name, newLink){
  try{
    await prisma.DiscordTable.update({
      where:{
        UniqueNameIdentifier: {
          server_id: serverID,
          name:name,
        }
      },
      data:{
        link:newLink
      }
      })
    }catch(error){
    console.error(error);
  }
}

//Add Delete CRUD commands

// TODO: check to make sure function only deletes one entry in table
async function deleteUniqueData(serverID, name){
  try{
    await prisma.DiscordTable.delete({
      where:{
        UniqueNameIdentifier: {
          server_id: serverID,
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

module.exports = {create, deleteUniqueData, readAllData, readUniqueData, updateDataLink, updateDataName, deleteAll};