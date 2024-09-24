/* eslint-disable prettier/prettier */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-08-26 10:16:45
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-24 14:24:03
 */
import React, { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import store from "store2";

import { emitter, EmitterEvent } from "@/services/event";

import { getProfile, profileResponseType } from "./user";

interface UserContext {
  userInfo?: profileResponseType;
  setUserInfo: (userInfo: profileResponseType) => void;
}

export const UserContext = React.createContext<UserContext>({} as UserContext);

export const UserProvider = (props: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = React.useState<profileResponseType>();
  const location = useLocation();

  useEffect(
    () => {
      const authInfo = store.get("authInfo");

      if (!authInfo) return;

      void getProfile()
        .then(data => setUserInfo(data))
        .catch(e => console.log("e", e));

      emitter.on(EmitterEvent.logout, () => {
        setUserInfo(undefined);
      });
    },
    [location.pathname]
  );

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
