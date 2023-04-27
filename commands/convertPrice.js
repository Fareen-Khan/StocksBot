const { SlashCommandBuilder, EmbedBuilder  } = require('discord.js');
const fetch = require('node-fetch');
const { yhFinanceId, yhFinanceHost } = require('../config.json');

module.exports={
  data:new SlashCommandBuilder()
    .setName("convert")
    .setDescription("Convert one currency amount to another")
    .addIntegerOption(option=>
      option.setName("value")
      .setRequired(true)
      .setDescription("Enter the value you want to convert")
    )
    .addStringOption(option=>
      option.setName("from")
      .setRequired(true)
      .setDescription("Enter the original currency")
    )
    .addStringOption(option=>
      option.setName("to")
      .setRequired(true)
      .setDescription("Enter the currency you want to convert to")
    ),

    async execute(interaction) {
      const val = interaction.options.getInteger("value");
      const stockEmbed = new EmbedBuilder();
      const from = interaction.options.getString("from");
      const to = interaction.options.getString("to");
      const options = {
        method: 'GET',
        headers: {
          'content-type': 'application/octet-stream',
          'X-RapidAPI-Key': yhFinanceId,
          'X-RapidAPI-Host': yhFinanceHost
        }
      };
      try {
        const url = `https://yh-finance-complete.p.rapidapi.com/convert?from=${from}&to=${to}&amount=${val}`;
        const response = await fetch(url, options);
        const result = await response.json();
        stockEmbed
        .setColor(0xB24BF3)
        .setTitle("Conversion")
        .addFields(
          {name:"**Original** ", value:`${val} ${from.toUpperCase()}`, inline:true},
          {name:"**Converted** ", value:`${result.result} ${to.toUpperCase()}`, inline:true}
        )
        .setFooter({text:"StocksBot", iconURL:"https://i.imgur.com/Wb7DFBi.png"})
        .setTimestamp()
        await interaction.deferReply();
        await interaction.editReply({embeds:[stockEmbed]});
      } catch (error) {
        console.error(error);
      }
    }
};