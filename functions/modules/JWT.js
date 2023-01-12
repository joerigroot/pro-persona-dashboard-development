import jsSHA from 'jssha';
import jwtDecode from 'jwt-decode';
import { Base64 } from 'js-base64';
export default class JWT {
    static create(properties, secret, signage = 'HS256') {
        const header = this.encode(this.getHeader(signage));
        const payload = this.encode(properties);
        const signable = `${header}.${payload}`;
        const sign = this.sign(signage, signable, secret);
        return `${signable}.${sign}`;
    }
    static read(token) {
        const decodedHeader = jwtDecode(token, { header: true });
        const decodedPayload = jwtDecode(token);
        const encodedSecret = token.split('.')[2];
        return {
            header: decodedHeader,
            payload: decodedPayload,
            signature: encodedSecret,
        };
    }
    static verifySecret(token, secret) {
        const tokenParts = token.split('.');
        const signable = `${tokenParts[0]}.${tokenParts[1]}`;
        const signedSecret = this.sign('HS256', signable, secret);
        const isCorrectSecret = signedSecret === tokenParts[2];
        return isCorrectSecret;
    }
    static sign(signage, value, secret) {
        const isHmac = signage.startsWith('H');
        const isSha = signage.startsWith(isHmac ? 'HS' : 'S');
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
    static encode(object) {
        return object && typeof object === 'object'
            ? Base64.encode(JSON.stringify(object), true)
            : '';
    }
    static getHeader(signage) {
        return { alg: signage, typ: 'JWT' };
    }
}
