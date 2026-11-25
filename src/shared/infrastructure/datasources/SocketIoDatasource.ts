import { io, Socket } from 'socket.io-client';
import { SocketDatasource, SocketEventHandler } from './SocketDatasource';

/** Implementación del contrato SocketDatasource con Socket.IO. */
export class SocketIoDatasource implements SocketDatasource {
  private socket: Socket | null = null;
  // Los handlers se guardan aparte para poder registrarlos antes de conectar
  private readonly handlers = new Map<string, Set<SocketEventHandler<unknown>>>();
  private readonly url: string;

  constructor(
    url = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000',
  ) {
    this.url = url.replace(/\/$/, '');
  }

  connect(token: string): void {
    this.disconnect();
    this.socket = io(this.url, {
      auth: { token }, // viaja en el handshake; el gateway lo valida
      transports: ['websocket'],
      reconnectionAttempts: 5,
    });
    for (const [event, set] of this.handlers) {
      for (const handler of set) {
        this.socket.on(event, handler);
      }
    }
  }

  disconnect(): void {
    if (!this.socket) return;
    this.socket.removeAllListeners();
    this.socket.disconnect();
    this.socket = null;
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  on<TPayload = unknown>(
    event: string,
    handler: SocketEventHandler<TPayload>,
  ): () => void {
    const set = this.handlers.get(event) ?? new Set();
    set.add(handler as SocketEventHandler<unknown>);
    this.handlers.set(event, set);
    this.socket?.on(event, handler);

    return () => {
      set.delete(handler as SocketEventHandler<unknown>);
      this.socket?.off(event, handler);
    };
  }

  emit<TPayload = unknown>(event: string, payload?: TPayload): void {
    this.socket?.emit(event, payload);
  }
}