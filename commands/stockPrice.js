const { SlashCommandBuilder, EmbedBuilder  } = require('discord.js');
const fetch = require('node-fetch');
const { yhFinanceId, yhFinanceHost } = require('./config.json');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('price')
		.setDescription('Replies with price of Stock!')
    .addStringOption((option) => 
      option.setName("name")
        .setRequired(true)
        .setDescription("Enter the Shortform Stock Name")
    ),
	
    async execute(interaction) {
    const stockName = interaction.options.getString("name");
    const stockEmbed = new EmbedBuilder();
    //Finance API to get stock price
    const url = `https://yh-finance-complete.p.rapidapi.com/yhprice?ticker=${stockName}`;
    const options = {
      method: 'GET',
      headers: {
        'content-type': 'application/octet-stream',
        'X-RapidAPI-Key': yhFinanceId,
        'X-RapidAPI-Host': yhFinanceHost
      }
    };
    try {
      const response = await fetch(url, options);
      const result = await response.json();
      console.log(result.price + result.currency);
      stockEmbed
        .setColor(0xB24BF3)
        .setTitle(`${stockName}`)
        .addFields(
          {name:"**Price** ", value:`${result.price}`},
          {name:"**Currency**", value:`${result.currency}`},
        )
        await interaction.deferReply();
        await interaction.editReply({embeds:[stockEmbed]});
    } catch (error) {
      console.error(error);
    }
	},
};