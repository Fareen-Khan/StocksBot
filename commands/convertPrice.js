const { SlashCommandBuilder, EmbedBuilder  } = require('discord.js');
const fetch = require('node-fetch');
const { RapidId, DataHost } = require('../config.json');

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
          'X-RapidAPI-Key': RapidId,
          'X-RapidAPI-Host': DataHost
        }
      };
      try {
        const url = `https://twelve-data1.p.rapidapi.com/currency_conversion?symbol=${from}%2F${to}&amount=${val}`;
        const response = await fetch(url, options);
        const result = await response.json();
        stockEmbed
        .setColor(0xB24BF3)
        .setTitle("Conversion")
        .addFields(
          {name:`**Original (${from.toUpperCase()}**)`, value:`${val.toFixed(2)}`, inline:true},
          {name:`**Converted (${to.toUpperCase()})**`, value:`${result.amount.toFixed(2)} `, inline:true},
          {name:"**Rate**", value:`${result.rate.toFixed(2)}`, inline:true}
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