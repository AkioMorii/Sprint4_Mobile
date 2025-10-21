import React, { createContext, useContext, useMemo, useReducer, useRef, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Simulation = {
  id: string;
  started: number;
  won: number;
  lost: number;
  final: number;
  createdAt: number;
};

type State = Simulation[];

type Action =
  | { type: 'HYDRATE'; payload: Simulation[] }
  | { type: 'ADD'; payload: Simulation }
  | { type: 'UPDATE'; payload: Simulation };

type Ctx = {
  list: Simulation[];
  add: (s: Simulation) => void;
  update: (s: Simulation) => void;
  getById: (id: string) => Simulation | undefined;
};

const SimCtx = createContext<Ctx | null>(null);

// Chave simples global
const STORAGE_KEY = 'simulations';

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'HYDRATE':
      return [...action.payload];
    case 'ADD':
      return [action.payload, ...state];
    case 'UPDATE':
      return state.map((it) => (it.id === action.payload.id ? { ...action.payload } : it));
    default:
      return state;
  }
}

export function SimProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, []);
  const hydratedRef = useRef(false);

  // Carregar do AsyncStorage na inicialização
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            // Sanitize mínimo
            const safe: Simulation[] = parsed
              .filter((x) => x && typeof x === 'object')
              .map((x) => ({
                id: String(x.id),
                started: Number(x.started) || 0,
                won: Number(x.won) || 0,
                lost: Number(x.lost) || 0,
                final: Number(x.final) || 0,
                createdAt: Number(x.createdAt) || Date.now(),
              }));
            dispatch({ type: 'HYDRATE', payload: safe });
          }
        }
      } catch (e) {
        console.warn('Falha ao ler simulações do AsyncStorage:', e);
      } finally {
        hydratedRef.current = true;
      }
    })();
  }, []);

  // Salvar toda vez que o estado mudar (após hidratar)
  useEffect(() => {
    if (!hydratedRef.current) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch((e) =>
      console.warn('Falha ao salvar simulações no AsyncStorage:', e)
    );
  }, [state]);

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
