import { ILoadOptionsFunctions } from 'n8n-workflow';
import axios from 'axios';

export class HelenChatService {

static async getChannelsIds(
    otp: ILoadOptionsFunctions,
): Promise<Array<{ name: string; value: string }>> {
    const url = 'https://api-test.helena.run/chat/v1/channel';
    const credentials = await otp.getCredentials('HelenaTestApi');
    const token = credentials?.apiKey as string;

    try {
        const response = await axios.get(url, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        const channels = response.data;
        console.log('Channels');
        console.log(channels);

        return channels.map((channel: any) => ({
            name: channel.identity.humanId + ' ' + channel.identity.platform,
            value: channel.id,
        }));
    } catch (error) {
        throw new Error(`Failed to load tags: ${error.message}`);
    }
 }

 static async getBots(otp: ILoadOptionsFunctions): Promise<Array<{ name: string; value: string}>> {
    const url = 'https://api-test.helena.run/chat/v1/chatbot';

    const credentials = await otp.getCredentials('HelenaTestApi');
    const token = credentials?.apiKey as string;

    try {
      const response = await axios.get(url, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        }
      });

      const data = response.data;
      console.log("Bots response data")
      console.log(data)
      return data.items.map((bot: any) => ({
      name: bot.name,
      value: bot.id
      }));
    }
    catch(error) {
        throw new Error(`Failed to load tags: ${error.message}`);
    }
}
}