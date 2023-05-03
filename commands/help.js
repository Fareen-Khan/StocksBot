const { SlashCommandBuilder, EmbedBuilder  } = require('discord.js');
const fs = require('fs');

module.exports={
  data:new SlashCommandBuilder()
    .setName("help")
    .setDescription("Learn about stocksbot"),

  async execute(interaction){
    const helpEmbed = new EmbedBuilder()
      .setColor(0xB24BF3)
      .setTitle("Help")
      .setDescription("This Bot allows you to see and track your favorite Stocks. It is a quick way to check prices with little to no hassle.")
      .setFooter({text:"StocksBot", iconURL:"https://i.imgur.com/Wb7DFBi.png"})
    const commandFiles = fs.readdirSync(__dirname).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
      const command = require(`./${file}`);
      helpEmbed.addFields(
        {name:`**${command.data.name}**`, value: `${command.data.description}`}
      )
    }
    helpEmbed.addFields(
      { name: '**Support**', value: '[Report a bug or any feedback](https://github.com/Fareen-Khan/StocksBot/issues).' },
    )
      .setTimestamp()

    await interaction.deferReply({ephemeral:true});
    await interaction.editReply({embeds:[helpEmbed]});
  }
}