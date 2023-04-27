const { SlashCommandBuilder, EmbedBuilder  } = require('discord.js');
const fetch = require('node-fetch');
const { yhFinanceId, yhFinanceHost } = require('../config.json');

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
    const url = `https://yh-finance-complete.p.rapidapi.com/summarydetails?symbol=${val}`;
    const options = {
      method: 'GET',
      headers: {
        'content-type': 'application/octet-stream',
        'X-RapidAPI-Key': yhFinanceId,
        'X-RapidAPI-Host': yhFinanceHost
      }
    };
    const response = await fetch(url, options);
    try {
      const stockEmbed = new EmbedBuilder();
      const result = await response.json();
      stockEmbed
      .setColor(0xB24BF3)
      .setTitle(`${val.toUpperCase()} Summary (${result.summary.summaryDetail.currency})`)
      .setURL(`https://ca.finance.yahoo.com/quote/TSLA?p=${val}`)
      .addFields(
        {name:"**Open**", value:`${result.summary.summaryDetail.open}`, inline:true},
        {name:"**Close**", value:`${result.summary.summaryDetail.previousClose}`, inline:true},
        { name: '\n', value: '\n' },
        {name:"**Day Low**", value:`${result.summary.summaryDetail.dayLow}`, inline:true},
        {name:"**Day High**", value:`${result.summary.summaryDetail.dayHigh}`, inline:true},
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