import { RealtimeHandlers } from '../entities/RealtimeEvents';

export interface RealtimeRepository {
  connect(token: string, handlers: RealtimeHandlers): void;
  disconnect(): void;
}