import { useReducer, useCallback, useEffect } from 'react';

// Action Types
const asyncReducer = (state, action) => {
  switch (action.type) {
    case 'pending':
      return { status: 'pending', data: null, error: null };
    case 'resolved':
      return { status: 'resolved', data: action.data, error: null };
    case 'rejected':
      return { status: 'rejected', data: null, error: action.error };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

// Hook Implementation
const useAsync = (asyncFunction, initialState = {}, immediate = true) => {
  const [state, dispatch] = useReducer(asyncReducer, {
    status: 'idle',
    data: null,
    error: null,
    ...initialState,
  });

  const run = useCallback(
    async (...args) => {
      dispatch({ type: 'pending' });
      try {
        const data = await asyncFunction(...args);
        dispatch({ type: 'resolved', data });
      } catch (error) {
        dispatch({ type: 'rejected', error });
      }
    },
    [asyncFunction]
  );

  // Automatically run the function if immediate is set to true
  useEffect(() => {
    if (immediate) {
      run();
    }
  }, [run, immediate]);

  return {
    ...state,
    run, // We return the `run` function so it can be manually invoked if needed.
  };
};

export default useAsync;
