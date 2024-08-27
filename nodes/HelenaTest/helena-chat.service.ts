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


static async getTemplates(channelId: string, token: string): Promise<Array<{ name: string; value: string}>> {
    const url = `https://api-test.helena.run/chat/v1/template?ChannelId=${channelId}`;

    const result: any = [];
    let hasMore = true;
    let pageNumber = 0;

    while(hasMore){
        pageNumber+=1;
        try {
            const response = await axios.get(url, {
              headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
              },
              params: {
                pageNumber: pageNumber
              }
            });
      
            console.log("pAGE number:"+pageNumber)
            console.log("Carregando templates");
            const data = response.data;
            result.push(...data.items);
            console.log(data)
            if(!data.hasMorePages){
                console.log("Break");
                hasMore = false;
            }
            
          }
          catch(error) {
              throw new Error(`Failed to load tags: ${error.message}`);
          }
    }
    console.log("Reuslt")
    console.log(result)
    return result.map((template: any) => ({
        name: template.name,
        value: template.name
        }));
}

static async getNameTemplates(templateName: string, channelId: string, token: string): Promise<Array<{ name: string; value: string }>> {
    const url = `https://api-test.helena.run/chat/v1/template?ChannelId=${channelId}&IncludeDetails=Params&PageSize=100`;
  
    console.log("Nome do Templaete: " + templateName)
    console.log("ChannelId: " + channelId)
    console.log("url: " + url)

    try {

      const response = await axios.get(url, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        params : {
            name: templateName 
        }
      });
  
      const data = response.data;
  
      const result = data.items.flatMap((x: any) => x.params?.map((p: any) => ({
        name: p.name,
        value: p.name
      })));
      console.log("Result do name")
      console.log(result);
      return result
    } catch (error) {
      throw new Error(`Failed to load template parameters: ${error.message}`);
    }
}


}