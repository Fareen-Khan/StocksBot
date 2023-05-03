const { SlashCommandBuilder  } = require('discord.js');
const {deleteUniqueData, readUniqueData} = require("../db/dbQueries");
module.exports={
  data:new SlashCommandBuilder()
    .setName("unwatch")
    .setDescription("Delete a stock that you would like to unwatch")
    .addStringOption(option=>
      option.setName("name")
      .setRequired(true)
      .setDescription("Enter the Shortform Stock Name")
    ),
  
  async execute(interaction){
    const stockName = interaction.options.getString("name");
    let memberID = interaction.member.id;
    let servID = interaction.guild.id.toString();

    res = await deleteUniqueData(memberID, stockName);

    return await interaction.reply({content:`Deleted ${stockName} from your watch list !`, ephemeral:true});

  }
}