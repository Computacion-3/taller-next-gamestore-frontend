export type SocketEventHandler<TPayload = unknown> = (payload: TPayload) => void;

export type SocketConnectionStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'error';

/**
 * Contrato de infraestructura para comunicación reactiva en tiempo real (WebSockets).
 * Permite desacoplar el cliente concreto (Socket.IO / nativo) de los casos de uso y Redux.
 */
export interface SocketDatasource {
  connect(token: string): void;
  disconnect(): void;
  isConnected(): boolean;
  on<TPayload = unknown>(
    event: string,
    handler: SocketEventHandler<TPayload>,
  ): () => void;
  emit<TPayload = unknown>(event: string, payload?: TPayload): void;
}
