const { SlashCommandBuilder, EmbedBuilder  } = require('discord.js');
const fetch = require('node-fetch');
const { RapidId, DataHost } = require('../config.json');

module.exports = {
  data:new SlashCommandBuilder()
    .setName("summary")
    .setDescription("Provide a summary about the stock")
    .addStringOption(option =>
        option.setName("value")
          .setRequired(true)
          .setDescription("Enter the stock that you would like a summary for")
    ),

  async execute(interaction){
    const val = interaction.options.getString("value");
    const url = `https://twelve-data1.p.rapidapi.com/quote?symbol=${val}&interval=1day&outputsize=30&format=json`;
    const options = {
      method: 'GET',
      headers: {
        'content-type': 'application/octet-stream',
        'X-RapidAPI-Key': RapidId,
        'X-RapidAPI-Host': DataHost
      }
    };
    const response = await fetch(url, options);
    try {
      const stockEmbed = new EmbedBuilder();
      const result = await response.json();
      var companyLogo;
      try{
        const url = `https://twelve-data1.p.rapidapi.com/logo?symbol=${val}`;
        const response = await fetch(url, options);
        const result = await response.json();
        companyLogo = result.url;
      }catch (error){
        console.error(error);
      }
      stockEmbed
      .setColor(0xB24BF3)
      .setTitle(`${val.toUpperCase()} Summary (${result.currency})`)
      .setURL(`https://finance.yahoo.com/quote/${val}`)
      .setThumbnail(`${companyLogo}`)
      .addFields(
        {name:"**Open**", value:`${parseFloat(result.open).toFixed(2)}`, inline:true},
        {name:"**Previous Close**", value:`${parseFloat(result.previous_close).toFixed(2)}`, inline:true},
        {name: '\n', value: '\n' },
        {name:"**Day Low**", value:`${parseFloat(result.low).toFixed(2)}`, inline:true},
        {name:"**Day High**", value:`${parseFloat(result.high).toFixed(2)}`, inline:true},
      )
      .setFooter({text:"StocksBot", iconURL:"https://i.imgur.com/Wb7DFBi.png"})
      .setTimestamp()
      await interaction.deferReply();
      await interaction.editReply({embeds:[stockEmbed]});
    } catch (error) {
      const stockEmbed = new EmbedBuilder();
      stockEmbed
      .setColor(0xB24BF3)
      .setTitle(`${val.toUpperCase()} Summary`)
      .addFields(
        {name:"**Warning**", value:`This stock does not exist`},
      )
      .setFooter({text:"StocksBot", iconURL:"https://i.imgur.com/Wb7DFBi.png"})
      .setTimestamp()
      await interaction.deferReply();
      await interaction.editReply({embeds:[stockEmbed]});
      console.error(error);
    }
  }
};