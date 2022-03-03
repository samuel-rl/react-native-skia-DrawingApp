import React, { useMemo } from 'react';
import {
  Menu, UxContextType, UxState,
} from '../utils/types';

export const UxContext = React.createContext<UxContextType | undefined>(
  undefined,
);

const createUxProviderValue = (): UxContextType => {
  const state: UxState = {
    menu: undefined,
  };

  const listeners = [] as ((state: UxState) => void)[];
  const notifyListeners = (s: UxState) => listeners.forEach((l) => l(s));

  const commands = {
    toggleMenu: (menu: Menu | undefined) => {
      state.menu = state.menu === menu ? undefined : menu;
      notifyListeners(state);
    },
  };

  return {
    state,
    commands,
    addListener: (cb: (state: UxState) => void) => {
      listeners.push(cb);
      return () => listeners.splice(listeners.indexOf(cb), 1);
    },
  };
};

export const useUxProvider = () => {
  const uxContext = useMemo(() => createUxProviderValue(), []);
  const retVal: React.FC = ({ children }) => (
    <UxContext.Provider value={uxContext}>{children}</UxContext.Provider>
  );
  return retVal;
};
