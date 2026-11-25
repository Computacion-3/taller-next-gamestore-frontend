import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RealtimeStatus } from '../../domain/entities/RealtimeEvents';

export interface RealtimeState {
  status: RealtimeStatus;
  detail: string | null;
  lastEventAt: string | null;
}

const initialState: RealtimeState = {
  status: 'disconnected',
  detail: null,
  lastEventAt: null,
};

const realtimeSlice = createSlice({
  name: 'realtime',
  initialState,
  reducers: {
    setRealtimeStatus(
      state,
      action: PayloadAction<{ status: RealtimeStatus; detail?: string | null }>,
    ) {
      state.status = action.payload.status;
      state.detail = action.payload.detail ?? null;
    },
    markRealtimeEvent(state, action: PayloadAction<string>) {
      state.lastEventAt = action.payload;
    },
  },
});

export const { setRealtimeStatus, markRealtimeEvent } = realtimeSlice.actions;
export const realtimeReducer = realtimeSlice.reducer;