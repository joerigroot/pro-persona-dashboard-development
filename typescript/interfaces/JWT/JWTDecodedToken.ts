import { SUTPayload } from '../SUT/SUTPayload';
import { JWTHeader } from './JWTHeader';

export interface JWTDecodedToken {
	header: JWTHeader;
	payload: SUTPayload;
	signature: string;
}
