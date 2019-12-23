import {
  useMemo,
  useState,
  useEffect,
} from 'react';
import { DEFAULT_TRANSITION_STATE } from '../constants';
import { TransitionStateProps } from '../types';

const useTransitionState = (
  initialState: Partial<TransitionStateProps>,
  runningState: Partial<TransitionStateProps>,
  doneState: Partial<TransitionStateProps>,
  duration: number,
) => {
  // eslint-disable-next-line no-underscore-dangle
  const _initialState = useMemo(() => ({
    ...DEFAULT_TRANSITION_STATE,
    ...initialState,
  }), []);

  const [ state, setState ] = useState(_initialState);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setState({
        ...DEFAULT_TRANSITION_STATE,
        ...runningState,
      });
    }, 10);

    const t2 = setTimeout(() => {
      setState({
        ...DEFAULT_TRANSITION_STATE,
        ...doneState,
      });
    }, duration);

    return () => {
      // clear the timeouts when the component is destroyed
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [ duration ]);

  return state;
};

export default useTransitionState;
