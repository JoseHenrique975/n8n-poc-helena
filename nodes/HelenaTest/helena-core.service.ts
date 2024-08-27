import { ILoadOptionsFunctions } from 'n8n-workflow';
import axios from 'axios';

export class HelenCoreService {
	static async getCustomFields(otp: ILoadOptionsFunctions) : Promise<Array<{ name: string; value: string }>> {
		const url = 'https://api-test.helena.run/core/v1/contact/custom-field';
		const credentials = await otp.getCredentials('HelenaTestApi');
		const token = credentials?.apiKey as string;

		try {
			console.log('Try do getCustomFields');
			const response = await axios.get(url, {
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			});
			const fields = response.data;

			return fields.map((field: { key: string; name: string }) => ({
				name: field.name,
				value: field.key,
			}));
		} catch (error) {
			throw new Error(`Failed to load custom fields: ${error.message}`);
		}
	}

	static async getContactById(contactId: string, token:string) : Promise<any>{

		const urlContact = `https://api-test.helena.run/core/v1/contact/${contactId}`;
		try {
			const response = await axios.get(urlContact, {
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			});

			const data = response.data;
			console.log('Data');
			console.log(data);
			return data;
		} catch (error) {
			console.log('Error ');
			console.log(error);
			throw new Error(`API request failed: ${error.message}`);
		}
	}

	static async getTagsIds(otp: ILoadOptionsFunctions): Promise<Array<{ name: string; value: string }>> {
		const url = 'https://api-test.helena.run/core/v1/tag';
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

			const tags = response.data;

			return tags.map((tag: { name: string; id: string }) => ({
				name: tag.name,
				value: tag.id,
			}));
		} catch (error) {
			throw new Error(`Failed to load tags: ${error.message}`);
		}
	}

	static async getUsersIds(otp: ILoadOptionsFunctions): Promise<Array<{ name: string; value: string }>> {
		const url = 'https://api-test.helena.run/core/v1/agent';
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

			const users = response.data;
			console.log('Users');
			console.log(users);

			return users.map((user: any) => ({
				name: user.name,
				value: user.userId,
			}));
		} catch (error) {
			throw new Error(`Failed to load tags: ${error.message}`);
		}
	}

	static async getDepartmentsIds(otp: ILoadOptionsFunctions): Promise<Array<{ name: string; value: string }>> {
		const url = 'https://api-test.helena.run/core/v1/department';
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

			const departments = response.data;

			return departments.map((department: { name: string; id: string }) => ({
				name: department.name,
				value: department.id,
			}));
		} catch (error) {
			throw new Error(`Failed to load tags: ${error.message}`);
		}
	}


	static async getUsersByDepartments(departmentId: string, token: string): Promise<Array<{ name: string; value: string }>> {
		const url = 'https://api-test.helena.run/core/v1/agent';
		console.log('Department escolhido')
		console.log(departmentId)

		if (!departmentId) {
			throw new Error(`Choose department`);
		}

		try {
			const response = await axios.get(url, {
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			});

			const users = response.data;
			const result: any = [];
			users.map((user: any) => {
				user.departments.map((element: any) => {
					if(element.departmentId === departmentId){
					  result.push(user);
					}
				})
			});
			console.log('Result');
			console.log(result);
			 
			return result.map((user: any) => ({
				name: user.name,
				value: user.userId,
			}));
		} catch (error) {
			throw new Error(`Failed to load users: ${error.message}`);
		}
	}

}