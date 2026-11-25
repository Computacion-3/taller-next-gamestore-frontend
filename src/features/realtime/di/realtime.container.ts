import { SocketIoDatasource } from '@/shared/infrastructure/datasources/SocketIoDatasource';
import {
  ConnectRealtimeUseCase,
  DisconnectRealtimeUseCase,
} from '../domain/usecases/realtimeUseCases';
import { RealtimeRepositoryImpl } from '../infrastructure/repositories/RealtimeRepositoryImpl';

const socketDatasource = new SocketIoDatasource();
const realtimeRepository = new RealtimeRepositoryImpl(socketDatasource);

export const realtimeContainer = {
  connectRealtimeUseCase: new ConnectRealtimeUseCase(realtimeRepository),
  disconnectRealtimeUseCase: new DisconnectRealtimeUseCase(realtimeRepository),
};