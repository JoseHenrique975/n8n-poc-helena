import {
	IAuthenticateGeneric,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class HelenaTestApi implements ICredentialType {
	name = 'HelenaTestApi';
	displayName = 'HELENA Test API';
	// Uses the link to this tutorial as an example
	// Replace with your own docs links when building your own nodes
	documentationUrl = 'https://docs.n8n.io/integrations/creating-nodes/build/declarative-style-node/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			default: 'https://api.wts.chat/auth/v1/login/validate',
			placeholder: 'Entre com sua API KEY aqui',
			description: 'A API Key é usada para ter acesso a API da HELENA'
		},
	];
	authenticate = {
		type: 'generic',
		properties: {
			headers: {
            Authorization: '=Bearer {{$credentials.apiKey}}'
			},
			url: 'https://api.wts.chat/auth/v1/login/validate',
			qs: {
				'api_key': '={{$credentials.apiKey}}'
			}
		},
	} as IAuthenticateGeneric;
}