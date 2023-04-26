const {Client, IntentsBitField} = require("discord.js");
require("dotenv").config();

const client = new Client({
  intents:[
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ]
});

client.on("ready", (c)=>{
  console.log(`✅ ${c.user.tag} is online.`)
});

client.on("messageCreate", (m)=>{
  if(m.author.bot){
    return;
  }

  if(m.content === ".hi"){
    m.reply(`Hi ${m.author}!`)
  }
});

client.login(process.env.TOKEN);