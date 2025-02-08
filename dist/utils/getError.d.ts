import MailTMError from '../errors/MailTMError';
import type { AxiosResponse } from 'axios';
export default function getError<Response extends AxiosResponse>(response: Response): MailTMError | Response;
