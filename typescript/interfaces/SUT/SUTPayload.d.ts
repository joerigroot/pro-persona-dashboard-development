import { JWTExpiringPayload } from '../JWT/JWTExpiringPayload';

export interface SUTPayload extends JWTExpiringPayload {
	userName: string;
}
