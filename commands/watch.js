const { SlashCommandBuilder  } = require('discord.js');
const {create, readUniqueData} = require("../db/dbQueries");
// TODO check that the name for the stock entered can be accessed with the API
module.exports={
  data:new SlashCommandBuilder()
    .setName("watch")
    .setDescription("Set a stock that you would like to watch(max of 5)")
    .addStringOption(option=>
      option.setName("name")
      .setRequired(true)
      .setDescription("Enter the Shortform Stock Name")
    ),
  
    async execute(interaction){
      const stockName = interaction.options.getString("name");
      let memberID = interaction.member.id;
      let servID = interaction.guild.id.toString();

      let count = await readUniqueData(memberID);
      if (count.length < 5){
        let i =0;
        while(i<count.length){
          if(count[i].name == stockName){
            return await interaction.reply({content:"Already added to your watch list", ephemeral:true});
          }
          i++;
        }

        let res = await create(servID, stockName, memberID);
        if(!res.status){
          return await interaction.reply({content:res.message, ephemeral:true});
        }
        return await interaction.reply({content:`Added ${stockName} to your watch list !`});
      }
      return await interaction.reply({content:"You have already added 5 items to your watch list", ephemeral:true});
    }
}