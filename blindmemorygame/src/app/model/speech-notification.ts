import { SpeechEvent } from './speech-event';

export interface SpeechNotification<T> {
    event?: SpeechEvent;
    content?: T;
}
