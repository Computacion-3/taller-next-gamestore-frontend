import { RealtimeHandlers } from '../entities/RealtimeEvents';
import { RealtimeRepository } from '../repositories/RealtimeRepository';

export class ConnectRealtimeUseCase {
  constructor(private readonly repository: RealtimeRepository) {}

  execute(token: string | null, handlers: RealtimeHandlers): void {
    if (!token || token.trim().length === 0) {
      throw new Error('Se requiere una sesión activa para conectarse en tiempo real.');
    }
    this.repository.connect(token, handlers);
  }
}

export class DisconnectRealtimeUseCase {
  constructor(private readonly repository: RealtimeRepository) {}

  execute(): void {
    this.repository.disconnect();
  }
}