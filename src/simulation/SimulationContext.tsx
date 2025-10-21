import React, { createContext, useContext, useMemo, useReducer } from 'react';

export type Simulation = {
  id: string;
  started: number;
  won: number;
  lost: number;
  final: number;
  createdAt: number;
};

type State = Simulation[];

type Ctx = {
  list: Simulation[];
  add: (s: Simulation) => void;
  update: (s: Simulation) => void;
  getById: (id: string) => Simulation | undefined;
};

const SimCtx = createContext<Ctx | null>(null);

function reducer(state: State, action: { type: 'ADD' | 'UPDATE'; payload: Simulation }): State {
  switch (action.type) {
    case 'ADD':
      return [action.payload, ...state];
    case 'UPDATE':
      return state.map((it) => (it.id === action.payload.id ? action.payload : it));
    default:
      return state;
  }
}

export function SimProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, [
    // opcional: um item de exemplo
    { id: '1', started: 100, won: 30, lost: 10, final: 120, createdAt: Date.now() },
  ]);

  const value = useMemo<Ctx>(
    () => ({
      list: [...state].sort((a, b) => b.createdAt - a.createdAt),
      add: (sim) => dispatch({ type: 'ADD', payload: sim }),
      update: (sim) => dispatch({ type: 'UPDATE', payload: sim }),
      getById: (id) => state.find((s) => s.id === id),
    }),
    [state]
  );

  return <SimCtx.Provider value={value}>{children}</SimCtx.Provider>;
}

export function useSimulations() {
  const ctx = useContext(SimCtx);
  if (!ctx) throw new Error('useSimulations deve ser usado dentro de <SimProvider>');
  return ctx;
}
