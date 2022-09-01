import React, { ReactNode } from 'react';
import { useMount } from 'react-use';
import store from 'store2';

import { emitter, EmitterEvent } from '@/services/event';

import { getProfile, profileResponseType } from './user';

interface UserContext {
  userInfo?: profileResponseType;
  setUserInfo: (userInfo: profileResponseType) => void;
}

export const UserContext = React.createContext<UserContext>({} as UserContext);

export const UserProvider = (props: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = React.useState<profileResponseType>();

  useMount(() => {
    const authInfo = store.get('authInfo');
    if (!authInfo) return;
    void getProfile()
      .then((data) => setUserInfo(data))
      .catch((e) => console.log('e', e));

    emitter.on(EmitterEvent.logout, () => {
      setUserInfo(undefined);
    });
  });

  return (
    <UserContext.Provider
      value={{
        userInfo,
        setUserInfo
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
