import { JWTExpiringPayload } from './JWTExpiringPayload';
import { JWTHeader } from './JWTHeader';

export interface JWT {
	header: JWTHeader;
	payload: JWTExpiringPayload;
	hash: string;
}
