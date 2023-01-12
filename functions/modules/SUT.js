import JWT from './JWT';
export default class SUT {
    static create(secret, userName, expiresIn, properties = {}) {
        const sut = this.build(userName, expiresIn, properties);
        return JWT.create(sut, secret);
    }
    static build(userName, expiresIn, properties) {
        const now = Date.now();
        const exp = now + 1000 * expiresIn;
        return Object.assign(Object.assign({}, properties), { userName, exp });
    }
}
