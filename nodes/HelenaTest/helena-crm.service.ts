import { ILoadOptionsFunctions } from 'n8n-workflow';
import axios from 'axios';

export class HelenCrmService {

static async getPanels(
    otp: ILoadOptionsFunctions,
): Promise<Array<{ name: string; value: any }>> {
    const url = 'https://api-test.helena.run/crm/v1/panel';
    const credentials = await otp.getCredentials('HelenaTestApi');
    const token = credentials?.apiKey as string;

    let hasMore: boolean = true;
    let pageNumber: number = 0;
    const result = [];

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
      
            console.log("Page Number: " + pageNumber)
            const data = response.data;
            result.push(...data.items);
            console.log(data)
            if(!data.hasMorePages){
                hasMore = false;
            }
          }
          catch(error) {
              throw new Error(`Failed to load panels: ${error.message}`);
          }
    } 
    return result.map((panel: any) => ({
        name: panel.title,
        value: panel.id
        })); 
 }

 static async getCustomFieldsPanel(
    idPanel: string, token: string
): Promise<Array<{ name: string; value: string }>> {
    const url = `https://api-test.helena.run/crm/v1/panel/${idPanel}/custom-fields`;
        try {
            const response = await axios.get(url, {
              headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
              }
            });
      
            const data = response.data;
            const result = data.filter((field: any) => field.type != 'GROUP');
            console.log("Custom Fields do Painel que são diferentes do grupo");
            console.log(result);
            //data.filter((field: any) => field.type != 'GROUP');
            return result.map((customFieldPanel: any) => ({
                name: customFieldPanel.name,
                value: customFieldPanel.id
                })); 
          }
          catch(error) {
              throw new Error(`Failed to load panels: ${error.message}`);
          }
 }

 static async getStepsPanelId(panelId: string, token: string): Promise<Array<{ name: string; value: any }>>{
    const url = `https://api-test.helena.run/crm/v1/panel/${panelId}?IncludeDetails=Steps`;
   
    let steps: {name: string, value: string}[] = [];
    try {
        const response = await axios.get(url, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            }
        });

        const data = response.data;
        steps = data.steps;
    } catch(error){
        throw new ErrorEvent(`Failed to load steps: ${error.message}`);
    }
    return steps.map((step: any) => ({
        name: step.title,
        value: step.id
        }));
    }

    static async getTagsPanel(panelId: string, otp: ILoadOptionsFunctions): Promise<Array<{ name: string; value: any }>>{
        const url = `https://api-test.helena.run/crm/v1/panel/${panelId}?IncludeDetails=Tags`;
        const credentials = await otp.getCredentials('HelenaTestApi');
        const token = credentials?.apiKey as string;

        let tags: {name: string, value: string}[] = [];
        try {
            const response = await axios.get(url, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            });
    
            const data = response.data;
            tags = data.tags;
        } catch(error){
            throw new ErrorEvent(`Failed to load tags: ${error.message}`);
        }
        return tags.map((tag: any) => ({
            name: tag.name,
            value: tag.id
            }));
        }

}