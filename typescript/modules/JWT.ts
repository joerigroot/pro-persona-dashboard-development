import jsSHA from 'jssha';
import jwtDecode from 'jwt-decode';
import { Base64 } from 'js-base64';
import { JWTExpiringPayload } from '../interfaces/JWT/JWTExpiringPayload';
import { JWTHeader } from '../interfaces/JWT/JWTHeader';
import { JWTDecodedToken } from '../interfaces/JWT/JWTDecodedToken';
import { SUTPayload } from '../interfaces/SUT/SUTPayload';

export default class JWT {
	public static create(
		properties: JWTExpiringPayload,
		secret: string,
		signage = 'HS256'
	): string {
		const header: string = this.encode(this.getHeader(signage));
		const payload: string = this.encode(properties);
		const signable = `${header}.${payload}`;
		const sign = this.sign(signage, signable, secret);
		return `${signable}.${sign}`;
	}

	public static read(token: string): JWTDecodedToken {
		const decodedHeader = jwtDecode<JWTHeader>(token, { header: true });
		const decodedPayload = jwtDecode<SUTPayload>(token);
		const encodedSecret: string = token.split('.')[2];

		return {
			header: decodedHeader,
			payload: decodedPayload,
			signature: encodedSecret,
		};
	}

	public static verifySecret(token: string, secret: string): boolean {
		const tokenParts = token.split('.');
		const signable = `${tokenParts[0]}.${tokenParts[1]}`;
		const signedSecret = this.sign('HS256', signable, secret);
		const isCorrectSecret = signedSecret === tokenParts[2];

		return isCorrectSecret;
	}

	private static sign(signage: string, value: string, secret: string): string {
		const isHmac: boolean = signage.startsWith('H');
		const isSha: boolean = signage.startsWith(isHmac ? 'HS' : 'S');
		const hasSecret = !!secret;

		if (isHmac && isSha && !hasSecret)
			throw new Error('Hmac signage needs a valid secret');

		// eslint-disable-next-line new-cap
		const shaObj = new jsSHA('SHA-256', 'TEXT', {
			hmacKey: { value: secret, format: 'TEXT' },
		});
		shaObj.update(value);

		return Base64.encode(shaObj.getHash('HEX'), true);
	}

	private static encode(object: object): string {
		return object && typeof object === 'object'
			? Base64.encode(JSON.stringify(object), true)
			: '';
	}

	private static getHeader(signage: string): JWTHeader {
		return { alg: signage, typ: 'JWT' };
	}
}
