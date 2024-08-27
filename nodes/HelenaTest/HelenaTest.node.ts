import { IExecuteFunctions, ILoadOptionsFunctions, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
import axios from 'axios';
import { HelenCoreService } from './helena-core.service';
import { HelenChatService } from './helena-chat.service';
import { HelenCrmService } from './helena-crm.service';

/*REFATORAR EXECUTES DEPOIS*/
export class HelenaTest implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'WTS Chat',
		name: 'HelenaTest',
		icon: 'file:images/wtslogo.svg',
		group: ['transform'],
		version: [1],
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Get data from Wts API',
		defaults: {
			name: 'WTS Chat',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'HelenaTestApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api-test.helena.run',
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Contact',
						value: 'contact',
					},
					{
						name: 'Message',
						value: 'message',
					},
					{
						name: 'Session',
						value: 'session',
					},
					{
						name: 'Panel',
						value: 'panel'
					}
				],
				default: '',
				description: 'Resource to use.',
			},

			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['contact']
					}
				},
				options: [
					{
						name: 'Get All Contacts',
						value: 'getAllContacts',
						description: 'Fetch all contacts from the API',
						action: 'List Contacts',
					},
					{
						name: 'Get By Id',
						value: 'getContactById',
						description: 'Get contact by id',
						action: 'Get Contact by id',
					},
					{
						name: 'Get By Phone',
						value: 'getContactByPhone',
						description: 'Get contact by phonenumber',
						action: 'Get contact by phone'
					},
					{
						name: 'Create Contact',
						value: 'createContact',
						description: 'Create contact',
						action: 'Create contact'
					}],
					default: ''
				}, 
				{
					displayName: 'Operation',
					name: 'operation',
					type: 'options',
					displayOptions: {
						show: {
							resource: ['message']
						}
					},
					options: [
				
					{
						name: 'Get Message By Id',
						value: 'getMessageById',
						description: 'Get message by id',
						action: 'Get message',
					},
					{
						name: 'Get Message Status',
						value: 'getMessageStatus',
						description: 'Get message status',
						action: 'Get message status'
					},
					{
						name: 'Get All Messages',
						value: 'getAllMessages',
						description: 'Get all messages',
						action: 'List messages'
					},
					{
						name: 'Send Message Text',
						value: 'sendMessageText',
						description: 'Send text',
						action: 'Send Text'
					},
					{
                        name: 'Send Message File',
						value: 'sendMessageFile',
						description: 'Send File',
						action: 'Send File'
					},
					{
						name: 'Send Message Template',
						value: 'sendMessageTemplate',
						description: 'Send Template',
						action: 'Send Template'
					}],
					default: ''
				}, 
				{
					displayName: 'Operation',
					name: 'operation',
					type: 'options',
					displayOptions: {
						show: {
							resource: ['panel']
						}
					},
					options: [
						{
							name: 'Gel All Annotation',
							value: 'getAllAnnotation',
							description: 'Get all notes from a card',
							action: 'List notes from a card'
						},
						{
							name: 'Create Card',
							value: 'createCard',
							description: 'Create card in panel',
							action: 'Create Card'
						},
						{
							name: 'Create Annotation Text',
							value: 'createAnnotationText',
							description: 'Create annotation text',
							action: 'Create Annotation Text'
						},
						{
							name: 'Create Annotation File',
							value: 'createAnnotationFile',
							description: 'Create annotation file',
							action: 'Create Annotation File'
						}
					],
					default: ''
				},
				{
						displayName: 'Operation',
						name: 'operation',
						type: 'options',
						displayOptions: {
							show: {
								resource: ['session']
							}
						},
						options: [
							{
								name: 'Get All Sessions',
								value: 'getAllSessions',
								description: 'Get all sessions',
								action: 'List Sessions'
							},
							
							{
								name: 'Update Session',
								value: 'updateSession',
								description: 'Update Session',
								action: 'Update Session'
							},
							{
								name: 'Update Status Session',
								value: 'updateStatusSession',
								description: 'Update status session',
								action: 'Update Status Session'
							}
						],
						default: ''
				},
				
				/*ELEMENTOS DE INTERFACE USUÁRIO*/
			{
				displayName: 'Panel',
				name: 'panels',
				type: 'options',
				default: '',
				placeholder: 'Choose Panel',
				description: '',
				typeOptions: {
					loadOptionsMethod: 'getPanels',
				},
				displayOptions: {
					show: {
						resource: ['panel'],
						operation: ['createCard'],
					},
				},
			},
            {
				displayName: 'Step',
				name: 'stepPanels',
				type: 'options',
				default: '',
				placeholder: 'Choose Step',
				description: '',
				typeOptions: {
					loadOptionsDependsOn: ['panels'],
					loadOptionsMethod: 'getStepsPanelId'
				},
				displayOptions: {
					show: {
						resource: ['panel'],
						operation: ['createCard'],
					},
				},
			},
			{
				displayName: 'Tags',
				name: 'tagsPanel',
				type: 'multiOptions',
				default: '',
				placeholder: 'Choose Tag',
				description: '',
				typeOptions: {
					loadOptionsDependsOn: ['stepPanels'],
					loadOptionsMethod: 'getTagsPanel'
				},
				displayOptions: {
					show: {
						resource: ['panel'],
						operation: ['createCard'],
					},
				},
			}, 
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				description: 'Title',
				displayOptions: {
					show: {
						resource: ['panel'],
						operation: ['createCard'],
					},
				},
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				typeOptions: {
					rows: 4,
				},
				description: 'Make your description',
				displayOptions: {
					show: {
						resource: ['panel'],
						operation: ['createCard'],
					},
				},
			},
			{
				displayName: 'Page Number',
				name: 'pageNumber',
				type: 'number',
				default: 1,
				description: 'The page number to retrieve.',
				displayOptions: {
					show: {
						resource: ['contact', 'message', 'session', 'panel'],
						operation: ['getAllContacts', 'getAllMessages', 'getAllSessions', 'getAllAnnotation'],
					},
				},
			},
			{
				displayName: 'Page Size',
				name: 'pageSize',
				type: 'number',
				default: 10,
				description: 'The number of items per page.',
				displayOptions: {
					show: {
						resource: ['contact', 'message', 'session', 'panel'],
						operation: ['getAllContacts', 'getAllMessages', 'getAllSessions', 'getAllAnnotation'],
					},
				},
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
			},
			{
				displayName: 'Order By',
				name: 'orderBy',
				type: 'string',
				default: '',
				description: 'Field to sort by.',
				displayOptions: {
					show: {
						resource: ['contact', 'message', 'session', 'panel'],
						operation: ['getAllContacts', 'getAllMessages', 'getAllSessions', 'getAllAnnotation'],
					},
				},
			},
			{
				displayName: 'Order Direction',
				name: 'orderDirection',
				type: 'options',
				options: [
					{ name: 'Ascending', value: 'ASCENDING' },
					{ name: 'Descending', value: 'DESCENDING' },
				],
				default: [],
				description: 'Direction of sorting.',
				displayOptions: {
					show: {
						resource: ['contact', 'message', 'session', 'panel'],
						operation: ['getAllContacts', 'getAllMessages', 'getAllSessions', 'getAllAnnotation'],
					},
				},
			},
			{
				displayName: 'Contact Id',
				name: 'contactId',
				type: 'string',
				default: 'Enter contact Id',
				description: '',
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['getContactById'],
					},
				},
			},
			{
				displayName: 'Phone Number',
				name: 'phonenumber',
				type: 'string',
				default: 'Enter phonenumber',
				description: '',
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['getContactByPhone', 'createContact'],
					},
				},
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: '',
				placeholder: 'Example',
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['createContact'],
					},
				},
			},
			{
				displayName: 'E-mail',
				name: 'email',
				type: 'string',
				default: '',
				description: '',
				placeholder: 'example@example.com',
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['createContact'],
					},
				},
			},
			{
				displayName: 'Instagram',
				name: 'instagram',
				type: 'string',
				default: '',
				description: 'Enter your Instagram name',
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['createContact'],
					},
				},
			},
			{
				displayName: 'Annotation',
				name: 'annotation',
				type: 'string',
				default: '',
				typeOptions: {
					rows: 4,
				},
				description: 'Make your note',
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['createContact'],
					},
				},
			},
			{
				displayName: 'Tags',
				name: 'tagIds',
				type: 'multiOptions',
				default: [],
				typeOptions: {
					loadOptionsMethod: 'getTagsIds',
				},
				displayOptions: {
					show: {
						resource: ['contact', 'session'],
						operation: ['createContact', 'getAllSessions'],
					},
				},
			},
			{
				displayName: 'Upsert',
				name: 'upsert',
				type: 'boolean',
				default: false,
				description:
					'With this option enabled, if the contact already exists in the database, it will be updated with the new data and returned.',
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['createContact'],
					},
				},
			},
			{
				displayName: 'Get If Exists?',
				name: 'getIfExists',
				type: 'boolean',
				default: false,
				description:
					'With this option enabled, if the contact already exists in the database, it will be returned and no data will be updated',
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['createContact'],
					},
				},
			},
			{
				displayName: 'Message Id',
				name: 'messageId',
				type: 'string',
				default: 'Enter message Id',
				description: '',
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['getMessageById', 'getMessageStatus'],
					},
				},
			},
			{
				displayName: 'Session Id',
				name: 'sessionId',
				type: 'string',
				default: '',
				placeholder: 'Enter session Id',
				description: '',
				displayOptions: {
					show: {
						resource: ['message', 'session'],
						operation: ['getAllMessages', 'sendMessageText', 'sendMessageFile', 'sendMessageTemplate', 'updateSession', 'updateStatusSession'],
					},
				},
			},
			{
				displayName: 'CreatedAt.After',
				name: 'createdAtAfter',
				type: 'dateTime',
				default: '',
				description: 'Enter YYYY-MM-DD hh:mm and the time according to your time zone ⚠️',
				displayOptions: {
					show: {
						resource: ['message', 'session'],
						operation: ['getAllMessages', 'getAllSessions'],
					},
				},
			},
			{
				displayName: 'CreatedAt.Before',
				name: 'createdAtBefore',
				type: 'dateTime',
				default: '',
				description: 'Enter YYYY-MM-DD hh:mm and the time according to your time zone ⚠️',
				displayOptions: {
					show: {
						resource: ['message', 'session'],
						operation: ['getAllMessages', 'getAllSessions'],
					},
				},
			},
			{
				displayName: 'UpdatedAt.After',
				name: 'updatedAtAfter',
				type: 'dateTime',
				default: '',
				description: 'Enter YYYY-MM-DD hh:mm and the time according to your time zone ⚠️',
				displayOptions: {
					show: {
						resource: ['message', 'session'],
						operation: ['getAllMessages', 'getAllSessions'],
					},
				},
			},
			{
				displayName: 'UpdatedAt.Before',
				name: 'updatedAtBefore',
				type: 'dateTime',
				default: '',
				description: 'Enter YYYY-MM-DD hh:mm and the time according to your time zone ⚠️',
				displayOptions: {
					show: {
						resource: ['message', 'session'],
						operation: ['getAllMessages', 'getAllSessions'],
					},
				},
			},
			{
				displayName: 'ActiveAt.After',
				name: 'activeAtAfter',
				type: 'dateTime',
				default: '',
				description: 'Enter YYYY-MM-DD hh:mm and the time according to your time zone ⚠️',
				displayOptions: {
					show: {
						resource: ['session'],
						operation: ['getAllSessions'],
					},
				},
			},
			{
				displayName: 'ActiveAt.Before',
				name: 'activeAtBefore',
				type: 'dateTime',
				default: '',
				description: 'Enter YYYY-MM-DD hh:mm and the time according to your time zone ⚠️',
				displayOptions: {
					show: {
						resource: ['session'],
						operation: ['getAllSessions'],
					},
				},
			},
			{
				displayName: 'EndAt.After',
				name: 'endAtAfter',
				type: 'dateTime',
				default: '',
				description: 'Enter YYYY-MM-DD hh:mm and the time according to your time zone ⚠️',
				displayOptions: {
					show: {
						resource: ['session'],
						operation: ['getAllSessions'],
					},
				},
			},
			{
				displayName: 'EndAt.Before',
				name: 'endAtBefore',
				type: 'dateTime',
				default: '',
				description: 'Enter YYYY-MM-DD hh:mm and the time according to your time zone ⚠️',
				displayOptions: {
					show: {
						resource: ['session'],
						operation: ['getAllSessions'],
					},
				},
			},
			{
				displayName: 'From',
				name: 'channelId',
				type: 'options',
				default: '',
				placeholder: 'Choose Channel',
				description: '',
				typeOptions: {
					loadOptionsMethod: 'getChannelsIds',
				},
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['sendMessageText', 'sendMessageFile', 'sendMessageTemplate'],
					},
				},
			},
			{
				displayName: 'To',
				name: 'numberToSend',
				type: 'string',
				default: '',
				placeholder: '',
				description: 'Number to send message to',
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['sendMessageText', 'sendMessageFile', 'sendMessageTemplate'],
					},
				},
			},
			{
              displayName: 'Templates',
			  name: 'templates',
			  type: 'options',
			  typeOptions: {
				loadOptionsDependsOn: ['channelId'],
				loadOptionsMethod: 'getTemplates'
			  },
			  default: '',
			  placeholder: 'Choose your template',
			  description: '',
			  displayOptions: {
				show: {
					resource: ['message'],
					operation: ['sendMessageTemplate'],
				},
			  },
			},
			{
              displayName: 'Params',
			  name: 'paramsTemplates',
			  type: 'fixedCollection',
			  default: '',
			  description: '',
			  placeholder: 'Add param',
			  typeOptions: {
				multipleValues: true
			},
			  options: [
				{
					name:'paramsTemplatesValues',
					displayName:'Params',
					values: [
						{
							displayName: 'Name',
							name: 'name',
							type: 'options',
							default: 'Name of the metadata key to add.',
							typeOptions: {
								loadOptionsMethod: 'getNameTemplates'
							}
						},
						{
							displayName: 'Value',
							name: 'value',
							type: 'string',
							default: '',
							description: 'Value to set for the metadata key.',
						}
					]
				}
			  ],
			  displayOptions: {
				show: {
					resource: ['message'],
					operation: ['sendMessageTemplate']
				}
			   }
			},
			
			{
				displayName: 'Url',
				name: 'urlFile',
				type: 'string',
				default: '',
				placeholder: '',
				description: 'Url file',
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['sendMessageFile', 'createAnnotationFile'],
					},
				},
				modes: [
					{
						displayName: 'hdbs',
						name: 'dshbfus',
						type: 'string',
						validation: [
						{
							type: 'regex',
							properties: {
								regex: /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/,
								errorMessage: 'Not a valid URL',
							},
						}],
					}
				]	
			},

			{
				displayName: 'File Urls',
				name: 'fileUrls',
				type: 'collection',
				default: [],
				placeholder: 'Add File',
				options: [
				  {
					displayName: 'URL',
					name: 'fileUrl',
					type: 'string',
					default: '',
					typeOptions: {
						multipleValues: true
					},
					description: '',
					placeholder: 'Add url file'
				  },
				],
				description: 'Specify a list of items.',
				displayOptions: {
					show: {
						resource: ['panel'],
						operation: ['createAnnotationFile']
					}
				}
			  },
			{
				displayName: 'Text',
				name: 'textMessage',
				type: 'string',
				default: '',
				description: '',
				placeholder: 'Write the text you want to send',
				typeOptions: {
					rows: 3,
				},
				displayOptions: {
					show: {
						resource: ['message', 'panel'],
						operation: ['sendMessageText', 'createAnnotationText'],
					},
				},
			},

			{
				displayName: 'Bots',
				name: 'botId',
				type: 'options',
				default: '',
				placeholder: 'Choose bot',
				description: '',
				typeOptions: {
					loadOptionsMethod: 'getBots',
				},
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['sendMessageText', 'sendMessageFile','sendMessageTemplate'],
					},
				},
			},

			{
				displayName: 'Departments',
				name: 'departmentId',
				type: 'options',
				default: '',
				placeholder: 'Choose department',
				description: '',
				typeOptions: {
					loadOptionsMethod: 'getDepartmentsIds',
				},
				displayOptions: {
					show: {
						resource: ['message', 'session'],
						operation: ['sendMessageText', 'getAllSessions', 'sendMessageFile', 'sendMessageTemplate', 'updateSession'],
					},
				},
			},
			
			{
				displayName: 'User',
				name: 'userIdByDepartment',
				type: 'options',
				default: '',
				placeholder: 'Choose user',
				description: 'Update this list of users, every time you change departments, to show users from that department.',
				typeOptions: {
					loadOptionsMethod: 'getUsersByDepartments',
					loadOptionsDependsOn: ['departmentId'],
				},
				displayOptions: {
					show: {
						resource: ['message', 'session'],
						operation: ['sendMessageText', 'sendMessageFile', 'sendMessageTemplate', 'updateSession']
					},
				},
			},
			{
				displayName: 'Channels',
				name: 'channelsIds',
				type: 'multiOptions',
				default: [],
				placeholder: 'Choose Channel',
				description: '',
				typeOptions: {
					loadOptionsMethod: 'getChannelsIds',
				},
				displayOptions: {
					show: {
						resource: ['session'],
						operation: ['getAllSessions'],
					},
				},
			},

			{
				displayName: 'User Id',
				name: 'userId',
				type: 'options',
				default: '',
				placeholder: 'Choose user',
				description: '',
				typeOptions: {
					loadOptionsMethod: 'getUsersIds',
				},
				displayOptions: {
					show: {
						resource: ['session', 'panel'],
						operation: ['getAllSessions', 'createCard'],
					},
				},
			},
			{
				displayName: 'Contact Id',
				name: 'contactId',
				type: 'string',
				default: '',
				placeholder: 'Enter contact Id',
				description: '',
				displayOptions: {
					show: {
						resource: ['message', 'session', 'panel'],
						operation: ['sendMessageText', 'getAllSessions', 'createCard'],
					},
				},
			},

			/*--------Session----------*/
			{
				displayName: 'Status Session',
				name: 'statusSession',
				type: 'multiOptions',
				default: [],
				placeholder: 'Choose status',
				description: '',
				options: [
					{
						name: 'Undefined',
						value: 'UNDEFINED',
					},
					{
						name: 'Started',
						value: 'Started',
					},
					{
						name: 'Pending',
						value: 'PENDING',
					},
					{
						name: 'In Progress',
						value: 'IN_PROGRESS',
					},
					{
						name: 'Completed',
						value: 'COMPLETED',
					},
					{
						name: 'Hidden',
						value: 'HIDDEN',
					},
				],
				displayOptions: {
					show: {
						resource: ['session'],
						operation: ['getAllSessions'],
					},
				},
			},
			{
				displayName: 'Status Session',
				name: 'statusSessionOption',
				type: 'options',
				default: [],
				placeholder: 'Choose status',
				description: '',
				options: [
					{
						name: 'Undefined',
						value: 'UNDEFINED',
					},
					{
						name: 'Started',
						value: 'Started',
					},
					{
						name: 'Pending',
						value: 'PENDING',
					},
					{
						name: 'In Progress',
						value: 'IN_PROGRESS',
					},
					{
						name: 'Completed',
						value: 'COMPLETED',
					},
					{
						name: 'Hidden',
						value: 'HIDDEN',
					},
				],
				displayOptions: {
					show: {
						resource: ['session'],
						operation: ['updateStatusSession'],
					},
				},
			},

			{
				displayName: 'Include Details',
				name: 'includeDetails',
				type: 'multiOptions',
				default: [],
				placeholder: 'Choose include details',
				description: '',
				options: [
					{
						name: 'Undefined',
						value: 'Undefined',
					},
					{
						name: 'AgentDetails',
						value: 'AgentDetails',
					},
					{
						name: 'DepartmentsDetails',
						value: 'DepartmentsDetails',
					},
					{
						name: 'ContactDetails',
						value: 'ContactDetails',
					},
					{
						name: 'ChannelTypeDetails',
						value: 'ChannelTypeDetails',
					},
					{
						name: 'ClassificationDetails',
						value: 'ClassificationDetails',
					},
					{
						name: 'ChannelDetails',
						value: 'ChannelDetails',
					},
				],
				displayOptions: {
					show: {
						resource: ['session'],
						operation: ['getAllSessions'],
					},
				},
			},

			/*--------Panel----------*/

			{
				displayName: 'Card Id',
				name: 'cardId',
				type: 'string',
				default: '',
				placeholder: 'Enter card Id',
				description: '',
				displayOptions: {
					show: {
						resource: ['panel'],
						operation: ['getAllAnnotation', 'createAnnotationText', 'createAnnotationFile'],
					},
				},
			},

			/*--------Send Message----------*/
			{
				displayName: 'Enable Bot',
				name: 'enableBot',
				type: 'boolean',
				default: false,
				description:
					'Determines whether the chatbot should be activated upon receiving a response from the contact',
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['sendMessageText','sendMessageFile', 'sendMessageTemplate'],
					},
				},
			},
			{
				displayName: 'Hidden Session',
				name: 'hiddenSession',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['sendMessageText', 'sendMessageFile', 'sendMessageTemplate'],
					},
				},
			},
			{
				displayName: 'Force Start Session',
				name: 'forceStartSession',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['sendMessageText', 'sendMessageFile', 'sendMessageTemplate'],
					},
				},
			},
			{
				displayName: 'Monetary Amount',
				name: 'monetaryAmount',
				type: 'number',
				default: '',
				placeholder: 'Enter amount',
				description: '',
				displayOptions: {
					show: {
						resource: ['panel'],
						operation: ['createCard'],
					},
				},
			},
			{
				displayName: 'Position',
				name: 'position',
				type: 'number',
				default: '',
				placeholder: 'Enter position',
				description: '',
				displayOptions: {
					show: {
						resource: ['panel'],
						operation: ['createCard'],
					},
				},
			},

			{
				displayName: 'Custom Fields',
				name: 'customFields',
				type: 'fixedCollection',
				default: '',
				placeholder: 'Add custom fields',
				typeOptions: {
					multipleValues: true,
				},
				description: '',
				options: [
					{
						name: 'customFields',
						displayName: 'Custom Fields',
						values: [
							{
								displayName: 'Key',
								name: 'key',
								type: 'options',
								default: 'Name of the custom field key to add.',
								typeOptions: {
									loadOptionsMethod: 'getCustomFields',
								},
								description: 'Select the key for the custom field',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'Value to set for the metadata key.',
							},
						],
					},
				],
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['createContact'],
					},
				},
			},
			{
				displayName: 'Custom Fields',
				name: 'customFieldsPanel',
				type: 'fixedCollection',
				default: '',
				placeholder: 'Add custom fields',
				typeOptions: {
					multipleValues: true,
				},
				description: '',
				options: [
					{
						name: 'customFields',
						displayName: 'Custom Fields',
						values: [
							{
								displayName: 'Key',
								name: 'key',
								type: 'options',
								default: 'Name of the custom field key to add.',
								typeOptions: {
									loadOptionsMethod: 'getCustomFieldsPanel',
									loadOptionsDependsOn: ['panels']
								},
								description: 'Select the key for the custom field',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'Value to set for the metadata key.',
							},
						],
					},
				],
				displayOptions: {
					show: {
						resource: ['panel'],
						operation: ['createCard'],
					},
				},
			},
			{
				displayName: 'Metada',
				name: 'metadata',
				placeholder: 'Add Metada',
				type: 'fixedCollection',
				default: '',
				typeOptions: {
					multipleValues: true,
				},
				options: [
					{
						name: 'metadata',
						displayName: 'Metadata',
						values: [
							{
								displayName: 'Key',
								name: 'metadataKey',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Value',
								name: 'metadaValue',
								type: 'string',
								default: '',
							},
						],
					},
				],
				displayOptions: {
					show: {
						resource: ['contact', 'panel'],
						operation: ['createContact', 'createCard'],
					},
				},
			},



		],
	};

	methods = {
		loadOptions: {

			/*----CORE----*/
			async getCustomFields(this: ILoadOptionsFunctions) : Promise<Array<{ name: string; value: string }>> {
				 return await HelenCoreService.getCustomFields(this); 
			},	

			async getTagsIds(this: ILoadOptionsFunctions) : Promise<Array<{ name: string; value: string }>> {
				 return await HelenCoreService.getTagsIds(this); 	
		    },	

			async getUsersIds(this: ILoadOptionsFunctions) : Promise<Array<{ name: string; value: string }>> {
				 return await HelenCoreService.getUsersIds(this); 
			},	

			async getDepartmentsIds(this: ILoadOptionsFunctions): Promise<Array<{name: string, value: any}>> {
				return await HelenCoreService.getDepartmentsIds(this);
			},


			async getUsersByDepartments(this: ILoadOptionsFunctions): Promise<Array<{ name: string; value: string }>> {
				const departmentId = this.getCurrentNodeParameter('departmentId') as string;
				const credentials = await this.getCredentials('HelenaTestApi');
				const token = credentials?.apiKey as string;
				return await HelenCoreService.getUsersByDepartments(departmentId, token);
			},
            
			/*----CRM----*/
			async getPanels(this: ILoadOptionsFunctions) :  Promise<Array<{ name: string; value: any }>> {
				 return await HelenCrmService.getPanels(this);
			},

			async getCustomFieldsPanel(this: ILoadOptionsFunctions): Promise<Array<{name: string, value: any}>> {
				const panelId = this.getNodeParameter('panels') as string;
				const credentials = await this.getCredentials('HelenaTestApi');
				const token = credentials?.apiKey as string;
				return await HelenCrmService.getCustomFieldsPanel(panelId, token);
			},
			async getStepsPanelId(this: ILoadOptionsFunctions): Promise<Array<{name:string, value: any}>> {
				const panelId = this.getNodeParameter('panels') as string;
				const credentials = await this.getCredentials('HelenaTestApi');
				const token = credentials?.apiKey as string; 
				return await HelenCrmService.getStepsPanelId(panelId, token);
			},
			async getTagsPanel(this: ILoadOptionsFunctions): Promise<Array<{ name: string; value: any }>> {
				const panelId = this.getNodeParameter('panels') as string;
				return await HelenCrmService.getTagsPanel(panelId, this);
			},

		

			/*----CHAT----*/

			async getTemplates(this: ILoadOptionsFunctions): Promise<Array<{ name: string; value: string}>> {
				const channelId = this.getCurrentNodeParameter('channelId') as string;
		
				const credentials = await this.getCredentials('HelenaTestApi');
				const token = credentials?.apiKey as string;
         		return await HelenChatService.getTemplates(channelId, token);
			},

			async getTemplatesIds(this: ILoadOptionsFunctions): Promise<Array<{ name: string; value: string}>> {
				const channelId = this.getCurrentNodeParameter('channelId') as string;
		
				const credentials = await this.getCredentials('HelenaTestApi');
				const token = credentials?.apiKey as string;
         		return await HelenChatService.getTemplates(channelId, token);
			},

			async getNameTemplates(this: ILoadOptionsFunctions): Promise<Array<{ name: string; value: string }>> {
				const template = this.getCurrentNodeParameter('templates') as string;
				
				const channelId = this.getCurrentNodeParameter('channelId') as string;
		  
				const credentials = await this.getCredentials('HelenaTestApi');
				const token = credentials?.apiKey as string;
				return await HelenChatService.getNameTemplates(template, channelId, token);
			},

			async getChannelsIds(this: ILoadOptionsFunctions) : Promise<Array<{ name: string; value: string }>> { 
				return await HelenChatService.getChannelsIds(this); 
			},

			async getBots(this: ILoadOptionsFunctions) : Promise<Array<{ name: string; value: string }>> { 
				return await HelenChatService.getBots(this); 
			},
		
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const results: INodeExecutionData[][] = [[]];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		const credentials = await this.getCredentials('HelenaTestApi');
		const token = credentials?.apiKey as string;

		const baseURL = 'https://api-test.helena.run';

		if (resource === 'contact' && operation === 'getContactById') {
			const idContact = this.getNodeParameter('contactId', 0) as string;
			var data = await HelenCoreService.getContactById(idContact, token);

			const items: INodeExecutionData[] = [ { json: data } ];
			results[0] = items;

		} else if(resource === 'contact' && operation === 'getContactByPhone'){
			 const phoneNumber = this.getNodeParameter('phonenumber', 0) as string;
             const url = `${baseURL}/core/v1/contact/phonenumber/${phoneNumber}`;

			 try {
				const response = await axios.get(url, {
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
				});

				const data = response.data;
				const items: INodeExecutionData[] = [{json: data,},];
				results[0] = items;
			 }
			 catch(error) {
				console.log("Error");
				throw new Error(`API request failed: ${error.message}`);
			 } 

		} else if (resource === 'contact' && operation === 'getAllContacts') {
			const pageNumber = this.getNodeParameter('pageNumber', 0) as number;
			const pageSize = this.getNodeParameter('pageSize', 0) as number;
			const orderBy = this.getNodeParameter('orderBy', 0) as string;
			const orderDirection = this.getNodeParameter('orderDirection', 0) as string;

			//const endpoint = '/core/v1/contact';
			const url = `${baseURL}/core/v1/contact`;

			const credentials = await this.getCredentials('HelenaTestApi');
			const token = credentials?.apiKey as string;

			console.log('Page size' + pageSize);
			console.log('Page Number ' + pageNumber);
			console.log('Order by' + orderBy);
			console.log('Order direction ' + orderDirection);

			try {
				const response = await axios.get(url, {
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					params: {
						page: pageNumber,
						pageSize,
						orderBy,
						orderDirection,
					},
				});

				console.log('Response: ');
				console.log(response);
				const data = response.data;
				console.log('Response: ' + data);

				const items: INodeExecutionData[] = data.items.map((contact: any) => ({
					json: contact,
				}));

				results[0] = items;
			} catch (error) {
				console.log('Error ');
				console.log(error);
				throw new Error(`API request failed: ${error.message}`);
			}

		} else if (resource === 'contact' && operation === 'createContact') {
			const url = `${baseURL}/core/v1/contact`;

			const name = this.getNodeParameter('name', 0) as string;
			const email = this.getNodeParameter('email', 0) as string;
			const phonenumber = this.getNodeParameter('phonenumber', 0) as string;
			const instagram = this.getNodeParameter('instagram', 0) as string;
			const annotation = this.getNodeParameter('annotation', 0) as string;
			const customFields = this.getNodeParameter('customFields', 0) as {
				customFields: { key: string; value: string }[];
			};
			const tagIds = this.getNodeParameter('tagIds', 0) as Array<string>;
			const metadata = this.getNodeParameter('metadata', 0) as {
				metadata: { key: string; value: string }[];
			};

			 const upsert = this.getNodeParameter('upsert', 0) as boolean;
			 const getIfExists = this.getNodeParameter('getIfExists', 0) as boolean;

			 console.log("Updsert: ")
			 console.log(upsert);
			 console.log("Get If Exists");
			 console.log(getIfExists);

			const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
			const matchEmail = email.match(regexEmail);

			if (!matchEmail) {
				throw new Error('Email inválido!');
			}

			const customFieldsObject = customFields?.customFields?.reduce(
				(acc: { [key: string]: string }, field) => {
					acc[field.key] = field.value;
					return acc;
				},
				{},
			);

			const metadataObject = metadata?.metadata?.reduce(
				(acc: { [key: string]: string }, metadata) => {
					acc[metadata.key] = metadata.value;
					return acc;
				},
				{},
			);

			const body = {
				name: name,
				email: email,
				phonenumber: phonenumber,
				instagram: instagram,
				annotation: annotation,
				tagIds: tagIds,
				...(metadataObject && { metadata: metadataObject}),
				...(customFieldsObject && { customFields: customFieldsObject}),

				options: {
					...(upsert && { upsert: upsert}),
					...(getIfExists && { getIfExists: getIfExists}),
				}
			}

			try {

				const response = await axios.post(url, body, {
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
				});

				console.log(tagIds);
				console.log(customFields);
				const data = response.data;
				console.log("Resposta da requisição: ")
				console.log(data);

				const items: INodeExecutionData[] = [
					{
						json: data,
					},
				];
				results[0] = items;
			} catch (error) {
				console.log('Error ');
				console.log(error);
				throw new Error(`API request failed: ${error.message}`);
			}
		} else if (resource === 'message' && operation === 'getMessageById') {
			const idMessage = this.getNodeParameter('messageId', 0) as string;

			const urlMessage = `${baseURL}/chat/v1/message/${idMessage}`;

			try {
				const response = await axios.get(urlMessage, {
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
				});

				const data = response.data;
				console.log('Data');
				console.log(data);
				const items: INodeExecutionData[] = [{json: data,},];
				results[0] = items;
			} catch (error) {
				console.log('Error ');
				console.log(error);
				throw new Error(`API request failed: ${error.message}`);
			}
		} else if (resource === 'message' && operation === 'getMessageStatus') {
			const idMessage = this.getNodeParameter('messageId', 0) as string;

			const urlMessage = `${baseURL}/chat/v1/message/${idMessage}/status`;

			try {
				const response = await axios.get(urlMessage, {
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
				});

				const data = response.data;
				console.log('Data');
				console.log(data);
				const items: INodeExecutionData[] = [
					{
						json: data,
					},
				];
				results[0] = items;
			} catch (error) {
				console.log('Error ');
				console.log(error);
				throw new Error(`API request failed: ${error.message}`);
			}
		} else if (resource === 'message' && operation === 'getAllMessages') {
			const sessionId = this.getNodeParameter('sessionId', 0) as string;
			const pageNumber = this.getNodeParameter('pageNumber', 0) as number;
			const pageSize = this.getNodeParameter('pageSize', 0) as number;
			const orderBy = this.getNodeParameter('orderBy', 0) as string;
			const orderDirection = this.getNodeParameter('orderDirection', 0) as string;

			const createdAtAfter = this.getNodeParameter('createdAtAfter', 0) as string;
			const createdAtBefore = this.getNodeParameter('createdAtBefore', 0) as string;
			const updatedAtAfter = this.getNodeParameter('updatedAtAfter', 0) as string;
			const updatedAtBefore = this.getNodeParameter('updatedAtBefore', 0) as string;

			const urlMessage = `${baseURL}/chat/v1/message`;

			console.log('Created At After:');
			console.log(createdAtAfter);

			console.log('Created At Before');
			console.log(createdAtBefore);

			try {
				const response = await axios.get(urlMessage, {
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					params: {
						sessionId: sessionId,
						pageNumber: pageNumber,
						pageSize: pageSize,
						orderBy: orderBy,
						orderDirection: orderDirection,

						'CreatedAt.After': createdAtAfter,
						'CreatedAt.Before': createdAtBefore,
						'UpdatedAt.After': updatedAtAfter,
						'UpdatedAt.Before': updatedAtBefore,
					},
				});

				const data = response.data;
				const items: INodeExecutionData[] = data.items.map((contact: any) => ({
					json: contact,
				}));

				results[0] = items;

				console.log('Response: ');
				console.log(data);
			} catch (error) {
				console.log('Error');
				console.log(error);
				throw new Error(`API request failed: ${error.message}`);
			}
		} else if (resource === 'message' && operation === 'sendMessageText') {
			const from = this.getNodeParameter('channelId', 0) as string;
			const to = this.getNodeParameter('numberToSend', 0) as string;
			const text = this.getNodeParameter('textMessage', 0) as string;
			const botId = this.getNodeParameter('botId', 0) as string;

			const departmentId = this.getNodeParameter('departmentId', 0) as string;
			const sessionId = this.getNodeParameter('sessionId', 0) as string;
			const userId = this.getNodeParameter('userIdByDepartment', 0) as string;

			const enableBot = this.getNodeParameter('enableBot', 0) as boolean;
			const hiddenSession = this.getNodeParameter('hiddenSession', 0) as boolean;
			const forceStartSession = this.getNodeParameter('forceStartSession', 0) as boolean;

			const urlSendMessage = `${baseURL}/chat/v1/message/send`;

            const body = {
                from: from,
                to: to,
				
                body: {
                    text: text,
                },
				options: {
					enableBot: enableBot,
					hiddenSession: hiddenSession,
					forceStartSession: forceStartSession
				},

			
				 ...(departmentId && { department: { id: departmentId } }),
				 ...(sessionId && { sessionId: sessionId }),
				 ...(botId && { botId: botId }),
				 ...(userId && { user: { id: userId } }),
			 }

			 console.log("Body")
			 console.log(body);

			try {

				const response = await axios.post(urlSendMessage, body, {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log("Response")
				console.log(response)
				const data = response.data;
				console.log('data');
				console.log(data);
				const items: INodeExecutionData[] = [];
                items.push({ json: data });

				results[0] = items;
				return results;
			} catch (error) {
				console.log('Error');
				console.log(error);
				throw new Error(`API request failed: ${error.message}`);
			}

		} else if (resource === 'session' && operation === 'getAllSessions') {
			const pageNumber = this.getNodeParameter('pageNumber', 0) as number;
			const pageSize = this.getNodeParameter('pageSize', 0) as number;
			const orderBy = this.getNodeParameter('orderBy', 0) as string;
			const orderDirection = this.getNodeParameter('orderDirection', 0) as string;

			const createdAtAfter = this.getNodeParameter('createdAtAfter', 0) as string;
			const createdAtBefore = this.getNodeParameter('createdAtBefore', 0) as string;
			const updatedAtAfter = this.getNodeParameter('updatedAtAfter', 0) as string;
			const updatedAtBefore = this.getNodeParameter('updatedAtBefore', 0) as string;
			const activeAtAfter = this.getNodeParameter('activeAtAfter', 0) as string;
			const activeAtBefore = this.getNodeParameter('activeAtBefore', 0) as string;
			const endAtAfter = this.getNodeParameter('endAtAfter', 0) as string;
			const endAtBefore = this.getNodeParameter('endAtBefore', 0) as string;

            const statusSession = this.getNodeParameter('statusSession', 0) as Array<string>;
			const departmentId = this.getNodeParameter('departmentId', 0) as string;
			const userId = this.getNodeParameter('userId', 0) as string;
			const tagIds = this.getNodeParameter('tagIds', 0) as Array<string>;
			const channelsIds = this.getNodeParameter('channelsIds', 0) as Array<string>;
			const contactId = this.getNodeParameter('contactId', 0) as string;
			const includeDetails = this.getNodeParameter('includeDetails', 0) as Array<string>;

			let urlSession = `${baseURL}/chat/v1/session`;
			
			const params = new URLSearchParams({});

			channelsIds.forEach(id => params.append('ChannelsId', id));
			statusSession.forEach(status => params.append('Status', status));
			includeDetails.forEach(details => params.append('IncludeDetails', details));

			urlSession += `?${params.toString()}`;
			
			try {
				console.log('Entrando no try')
				const response = await axios.get(urlSession, {
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					params: {
						status: statusSession,
						departmentId: departmentId,
						userId: userId,
						tagsId: tagIds,
						contactId: contactId,
						includeDetails: includeDetails,

						pageNumber: pageNumber,
						pageSize: pageSize,
						orderBy: orderBy,
						orderDirection: orderDirection,

						'CreatedAt.After': createdAtAfter,
						'CreatedAt.Before': createdAtBefore,
						'UpdatedAt.After': updatedAtAfter,
						'UpdatedAt.Before': updatedAtBefore,
						"ActiveAt.After": activeAtAfter,
						"ActiveAt.Before": activeAtBefore,
						"EndAt.After": endAtAfter,
						"EndAt.Before": endAtBefore
					},
				});

				const data = response.data;
				console.log("Data");
				console.log(data);
				const items: INodeExecutionData[] = data.items.map((session: any) => ({
					json: session,
				}));

				results[0] = items;

		   }catch (error) {
			console.log('Error');
			console.log(error);
			throw new Error(`API request failed: ${error.message}`);
		  }
		} else if(resource === 'panel' && operation === 'getAllAnnotation') {
          const cardId = this.getNodeParameter('cardId', 0) as string;
         
		  const pageNumber = this.getNodeParameter('pageNumber', 0) as number;
		  const pageSize = this.getNodeParameter('pageSize', 0) as number;
		  const orderBy = this.getNodeParameter('orderBy', 0) as string;
		  const orderDirection = this.getNodeParameter('orderDirection', 0) as string;

          const url = `${baseURL}/crm/v1/panel/card/${cardId}/note`;
          
		  try {

			const response = await axios.get(url, {
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				params: {
					pageNumber: pageNumber,
					pageSize: pageSize,
					orderBy: orderBy,
					orderDirection: orderDirection
				},
			});

			const data = response.data;

			console.log("Data");
			console.log(data);
			const items: INodeExecutionData[] = data.items.map((session: any) => ({
				json: session,
			}));

			results[0] = items;

		   }catch(error) {
			console.log('Error');
			console.log(error);
			throw new Error(`API request failed: ${error.message}`);
		  }

		} else if(resource === 'message' && operation === 'sendMessageFile'){
			const from = this.getNodeParameter('channelId', 0) as string;
			const to = this.getNodeParameter('numberToSend', 0) as string;
			const fileUrl = this.getNodeParameter('urlFile', 0) as string;
			const botId = this.getNodeParameter('botId', 0) as string;

			const departmentId = this.getNodeParameter('departmentId', 0) as string;
			const sessionId = this.getNodeParameter('sessionId', 0) as string;
			const userId = this.getNodeParameter('userIdByDepartment', 0) as string;

			const enableBot = this.getNodeParameter('enableBot', 0) as boolean;
			const hiddenSession = this.getNodeParameter('hiddenSession', 0) as boolean;
			const forceStartSession = this.getNodeParameter('forceStartSession', 0) as boolean;
             
			const url = `${baseURL}/chat/v1/message/send`;
			const body = {
                from: from,
                to: to,
				
                body: {
                    fileUrl: fileUrl,
                },
				options: {
					enableBot: enableBot,
					hiddenSession: hiddenSession,
					forceStartSession: forceStartSession
				},
				...(departmentId && { department: { id: departmentId } }),
				...(sessionId && { sessionId: sessionId }),
				...(botId && { botId: botId }),
				...(userId && { user: { id: userId } }),
		}

		try {
          const response = await axios.post(url, body, {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		  });

		  const data = response.data;
		  console.log('Resposta do envio de arquivo:');
		  console.log(data);
		  const items: INodeExecutionData[] = [];
          items.push({ json: data });

		   results[0] = items;
	       return results;
		}
		catch(error){
			console.log('Error');
			console.log(error);
			throw new Error(`API request failed: ${error.message}`);
		}
	} else if(resource === 'message' && operation === 'sendMessageTemplate'){
		/*Get parameters*/
	   const from = this.getNodeParameter('channelId', 0) as string;
	   const template = this.getNodeParameter('templates', 0) as string;
	   let templateObj = null;

	   if(template){
         templateObj = await HelenChatService.getTemplateIds(from, token, template);
	   }

	   const templateId = templateObj?.id;

	   const paramsTemplates = this.getNodeParameter('paramsTemplates', 0) as { paramsTemplatesValues: { name: string, value: string }[] };
	   const paramsArray = paramsTemplates.paramsTemplatesValues;
	   const to = this.getNodeParameter('numberToSend', 0) as string;

	   const departmentId = this.getNodeParameter('departmentId', 0) as string;
	   const sessionId = this.getNodeParameter('sessionId', 0) as string;
	   const userId = this.getNodeParameter('userIdByDepartment', 0) as string;
	   const botId = this.getNodeParameter('botId', 0) as string;

	   const enableBot = this.getNodeParameter('enableBot', 0) as boolean;
       const hiddenSession = this.getNodeParameter('hiddenSession', 0) as boolean;
	   const forceStartSession = this.getNodeParameter('forceStartSession', 0) as boolean;
	    
	   const nameSet = new Set<string>(); 
       const uniqueParams: { name: string, value: string }[] = [];

	   /*Manipulate data*/

   	    if (Array.isArray(paramsArray)) {
          paramsArray.forEach(param => {
            const { name, value } = param;

            if (!nameSet.has(name)) {
                nameSet.add(name);
                uniqueParams.push({ name, value });
            }
         });
	    }
        else {
		   results[0] = [{ json: { error: 'No paramsTemplates found' } }];
	    }

		const transformToObject = (params: { name: string, value: string }[]) => {
			const result: any = {};
			params.forEach(param => {
			  result[param.name] = param.value;
			});
			return { parameters: result };
		  };

		  console.log("Unique Params");
		  console.log(uniqueParams)
		  
		const body = {
			from: from,
			to: to,
			
			body: {
				templateId: templateId,
				...(uniqueParams && transformToObject(uniqueParams))
			},
			options: {
				enableBot: enableBot,
				hiddenSession: hiddenSession,
				forceStartSession: forceStartSession
			},

			...(sessionId && { sessionId: sessionId }),
			...(botId && { botId: botId }),
			...(userId && { user: { id: userId } }),
			...(departmentId && { department: { id: departmentId } })	
		}

	   /*Request*/

		const url = `${baseURL}/chat/v1/message/send`;

		try {
			const response = await axios.post(url, body, {
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			  });

              console.log(body)
			  const data = response.data;
			  console.log('Resposta do envio de template:');
			  console.log(data);
			  const items: INodeExecutionData[] = [];
			  items.push({ json: data });
	
			   results[0] = items;
			   return results;
		}catch(error){
			console.log('Error');
			console.log(error);
			throw new Error(`API request failed: ${error.message}`);
		}
	   
   
	   // Verificar se o número de parâmetros fornecidos excede o máximo permitido
	   // if (paramsTemplates.paramsTemplatesValues.length > maxParams) {
	   //	   throw new Error(`Cannot add more than ${maxParams} parameters. You have exceeded the allowed limit.`);
	   // }
   
		
	} else if(resource === 'panel' && operation === 'createCard'){

		const stepId = this.getNodeParameter('stepPanels', 0) as string;
		const title = this.getNodeParameter('title', 0) as string;
		const description = this.getNodeParameter('description', 0) as string;
		const position = this.getNodeParameter('position', 0) as number;
		const userId = this.getNodeParameter('userId', 0) as string;
		const tagsPanelIds = this.getNodeParameter('tagsPanel', 0) as Array<string>;
        const contactId = this.getNodeParameter('contactId', 0) as Array<string>;
		const monetaryAmount = this.getNodeParameter('monetaryAmount', 0) as string;

		const customFields = this.getNodeParameter('customFieldsPanel', 0) as {
			customFields: { key: string; value: string }[];
		};
		const metadata = this.getNodeParameter('metadata', 0) as {
			metadata: { key: string; value: string }[];
		};
  
		 const customFieldsObject = customFields?.customFields?.reduce(
		 	(acc: { [key: string]: string }, field) => {
		 		acc[field.key] = field.value;
		 		console.log("No reduce")
		 		console.log(acc)
		 		return acc;
		 	},
		 	{},
		);

		//const customFieldsObject: Map<string, string> = new Map<string, string>();
	//	customFields?.customFields?.forEach(field => {
	//		customFieldsObject.set(field.key, field.value)
	//	});

		const metadataObject = metadata?.metadata?.reduce(
			(acc: { [key: string]: string }, metadata) => {
				acc[metadata.key] = metadata.value;
				return acc;
			},
			{},
		);

		if(!title || title.trim() == ''){
			throw new Error('Title is empty, please fill it in');
		}

		if(!stepId) {
			throw new Error('Choose a panel and its step');
		}

		const body = {
			stepId: stepId,
			title: title,
			tagIds: tagsPanelIds,

			...(monetaryAmount && { monetaryAmount: monetaryAmount }),
			...(userId && { responsibleUserId: userId }),
			...(contactId && { contactIds: [ contactId ]}),
			...(position && { position: position }),
			...(description && { description: description }),
			...(metadataObject && { metadata: metadataObject}),
			...(customFieldsObject && { customFields: customFieldsObject}),
	    }

	const url = `${baseURL}/crm/v1/panel/card`;

	console.log("Body")
	console.log(body);

		try {
			const response = await axios.post(url, body, {
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			  });

			  const data = response.data;
			  console.log('Resposta do envio de card:');
			  console.log(data);
			  const items: INodeExecutionData[] = [];
			  items.push({ json: data });
	
			   results[0] = items;
			   return results;
		}
		catch(error) {
			console.log("Error")
			console.log(error);
			throw new Error(`API request failed: ${error.message}`);
		}
		
	} else if(resource === 'panel' && operation === 'createAnnotationText') {
		const cardId = this.getNodeParameter('cardId', 0) as string;
		const annotation = this.getNodeParameter('textMessage', 0) as string;

		if(!cardId){
			throw new Error('CardId cannot be empty');
		}
		if(!annotation){
			throw new Error('Annotation is empty, please fill it in');
		}

		const url = `${baseURL}/crm/v1/panel/card/${cardId}/note`;
		const body = {
          text: annotation
		}
		try {
			const response = await axios.post(url, body, {
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			  });

			  const data = response.data;
			  console.log('Resposta do envio de anotação do card: ');
			  console.log(data);
			  const items: INodeExecutionData[] = [];
			  items.push({ json: data });
	
			   results[0] = items;
			   return results;
		}
		catch(error) {
			console.log("Error")
			console.log(error);
			throw new Error(`API request failed: ${error.message}`);
		}

	}
	else if(resource === 'panel' && operation === 'createAnnotationFile'){
		const cardId = this.getNodeParameter('cardId', 0) as string;
		const fileUrls = this.getNodeParameter('fileUrls', 0) as any;
		const arrayUrls = fileUrls.fileUrl;

		console.log("Array Urls")
		console.log(arrayUrls)

		if(!cardId){
			throw new Error('CardId cannot be empty');
		}
		if(!arrayUrls){
			throw new Error('URL File is empty, please fill it in');
		}

		const url = `${baseURL}/crm/v1/panel/card/${cardId}/note`;

		const body = {
          fileUrls: arrayUrls
		}

		try {
			const response = await axios.post(url, body, {
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			  });

			  const data = response.data;
			  console.log('Resposta do envio de anotação do card: ');
			  console.log(data);

			  const items: INodeExecutionData[] = [];
			  items.push({ json: data });
	
			   results[0] = items;
			   return results;
		}
		catch(error) {
			console.log("Error")
			console.log(error);
			throw new Error(`API request failed: ${error.message}`);
		}
	} else if(resource === 'session' && operation === 'updateSession'){
		const sessionId = this.getNodeParameter('sessionId', 0) as string;
		const departmentId = this.getNodeParameter('departmentId', 0) as string;
		const userId = this.getNodeParameter('userIdByDepartment', 0) as string;

		if(!sessionId){
			throw new Error('CardId cannot be empty');
		}
/*
		if(!departmentId || !userId){
			throw new Error('Choose one department or user to transfer the conversation');
		}
*/
		const url = `${baseURL}/chat/v1/session/${sessionId}/transfer`;
		let type = departmentId && userId ? 'USER' : 'DEPARTMENT';

		const body = {
			type: type,
          ...(departmentId && {newDepartmentId: departmentId }),
		  ...(userId && {newUserId: userId})
		}

		console.log("Body")
		console.log(body);

		try {
			const response = await axios.put(url, body, {
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			  });

			  const data = response.data;
			  console.log('Resposta da atualização da conversa: ');
			  console.log(data);

			  const items: INodeExecutionData[] = [];
			  items.push({ json: data });
	
			   results[0] = items;
			   return results;
		}
		catch(error){
			console.log("Error")
			console.log(error);
			throw new Error(`API request failed: ${error.message}`);
		}
    }
	else if(resource === 'session' && operation === 'updateStatusSession') {
      const sessionId = this.getNodeParameter('sessionId', 0) as string;
      const status = this.getNodeParameter('statusSessionOption', 0) as string;

 	 if(!sessionId && !status){
		throw new Error(`API request failed: Fill in all fields`);
 	 }

 	const url = `${baseURL}/chat/v1/session/${sessionId}/status`;
	const body = {
		newStatus: status
	}

 	try {
		const response = await axios.put(url, body, {
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	  });

	  const data = response.data;
	  console.log('Resposta da atualização da conversa: ');
	  console.log(data);

	  const items: INodeExecutionData[] = [];
	  items.push({ json: data });

	   results[0] = items;
	   return results;
	}
	catch(error){
		console.log("Error")
		console.log(error);
		throw new Error(`API request failed: ${error.message}`);
	}
}
		return results;
	}
}

