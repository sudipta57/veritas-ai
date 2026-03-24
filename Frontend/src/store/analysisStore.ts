import { createContext, createElement, useContext, useReducer, type Dispatch, type ReactNode } from 'react';
import type { AccuracyReport } from '../services/api';

export interface AnalysisState {
  status: 'idle' | 'running' | 'complete' | 'error';
  inputType: 'TEXT' | 'URL' | 'PDF';
  inputContent: string;
  currentStage: string;
  stages: {
    label: string;
    status: 'completed' | 'active' | 'queued';
    icon: string;
    claims?: string[];
    queries?: string[];
    note?: string;
  }[];
  claimsFound: string[];
  verifiedSoFar: string[];
  report: AccuracyReport | null;
  errorMessage: string | null;
  cancelFn: (() => void) | null;
}

export type AnalysisAction =
  | { type: 'START'; inputType: AnalysisState['inputType']; inputContent: string }
  | { type: 'SET_STAGE'; stage: string }
  | { type: 'CLAIMS_FOUND'; claims: string[] }
  | { type: 'CLAIM_VERIFIED'; claim_id: string }
  | { type: 'COMPLETE'; report: AccuracyReport }
  | { type: 'ERROR'; message: string }
  | { type: 'SET_CANCEL'; cancelFn: () => void }
  | { type: 'RESET' };

const initialState: AnalysisState = {
  status: 'idle',
  inputType: 'TEXT',
  inputContent: '',
  currentStage: '',
  stages: [],
  claimsFound: [],
  verifiedSoFar: [],
  report: null,
  errorMessage: null,
  cancelFn: null,
};

function updateStageStatuses(
  stages: AnalysisState['stages'],
  activeIndex: number,
  completedIndexes: number[] = []
): AnalysisState['stages'] {
  return stages.map((stage, index) => ({
    ...stage,
    status: completedIndexes.includes(index)
      ? 'completed'
      : index === activeIndex
        ? 'active'
        : stage.status,
  }));
}

function analysisReducer(state: AnalysisState, action: AnalysisAction): AnalysisState {
  console.log('[Store reducer] action=', action.type, 'current status=', state.status);
  switch (action.type) {
    case 'START':
      return {
        ...state,
        status: 'running',
        inputType: action.inputType,
        inputContent: action.inputContent,
        currentStage: 'extracting',
        stages: [
          { label: 'Extracting Claims', status: 'active', icon: 'article', claims: [], queries: [] },
          { label: 'Searching the Web', status: 'queued', icon: 'search', claims: [], queries: [] },
          { label: 'Verifying & Scoring', status: 'queued', icon: 'assessment', claims: [], queries: [] },
          { label: 'Generating Report', status: 'queued', icon: 'summarize', claims: [], queries: [] },
        ],
        claimsFound: [],
        verifiedSoFar: [],
        report: null,
        errorMessage: null,
        cancelFn: null,
      };

    case 'SET_STAGE': {
      if (state.stages.length === 0) {
        return {
          ...state,
          currentStage: action.stage,
        };
      }

      if (action.stage === 'extracting') {
        return {
          ...state,
          currentStage: action.stage,
          stages: updateStageStatuses(state.stages, 0),
        };
      }

      if (action.stage === 'retrieving') {
        return {
          ...state,
          currentStage: action.stage,
          stages: updateStageStatuses(state.stages, 1, [0]),
        };
      }

      if (action.stage === 'verifying') {
        return {
          ...state,
          currentStage: action.stage,
          stages: updateStageStatuses(state.stages, 2, [0, 1]),
        };
      }

      if (action.stage === 'complete') {
        return {
          ...state,
          currentStage: action.stage,
          stages: state.stages.map((stage, index) => ({
            ...stage,
            status: index <= 3 ? 'completed' : stage.status,
          })),
        };
      }

      return {
        ...state,
        currentStage: action.stage,
      };
    }

    case 'CLAIMS_FOUND': {
      const stages = [...state.stages];
      if (stages[0]) {
        stages[0] = {
          ...stages[0],
          claims: action.claims,
        };
      }

      return {
        ...state,
        stages,
        claimsFound: action.claims,
      };
    }

    case 'CLAIM_VERIFIED': {
      const stages = [...state.stages];
      if (stages[1]) {
        stages[1] = {
          ...stages[1],
          queries: [...(stages[1].queries ?? []), `[verifying ${action.claim_id}...]`],
        };
      }

      return {
        ...state,
        verifiedSoFar: [...state.verifiedSoFar, action.claim_id],
        stages,
      };
    }

    case 'COMPLETE':
      console.log('[Reducer COMPLETE] setting report:', !!action.report, 'report_id:', action.report?.report_id);
      return {
        ...state,
        status: 'complete',
        report: action.report,
      };

    case 'ERROR':
      return {
        ...state,
        status: 'error',
        errorMessage: action.message,
      };

    case 'SET_CANCEL':
      return {
        ...state,
        cancelFn: action.cancelFn,
      };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

interface AnalysisContextValue {
  state: AnalysisState;
  dispatch: Dispatch<AnalysisAction>;
}

const AnalysisContext = createContext<AnalysisContextValue | undefined>(undefined);

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(analysisReducer, initialState);

  return createElement(AnalysisContext.Provider, { value: { state, dispatch } }, children);
}

export function useAnalysis(): AnalysisContextValue {
  const context = useContext(AnalysisContext);

  if (!context) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }

  return context;
}
