import { SUTPayload } from '../interfaces/SUT/SUTPayload';
import JWT from './JWT';

export default class SUT {
	public static create(
		secret: string,
		userName: string,
		expiresIn: number,
		properties: object = {}
	): string {
		const sut = this.build(userName, expiresIn, properties);
		return JWT.create(sut, secret);
	}

	private static build(
		userName: string,
		expiresIn: number,
		properties: object
	): SUTPayload {
		const now = Date.now();
		const exp = now + 1000 * expiresIn;
		return { ...properties, ...{ userName, exp } };
	}
}
