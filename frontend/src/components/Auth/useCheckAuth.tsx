import React, {useState, useEffect} from 'react'
import {useNavigate} from "react-router-dom";
import useStore from "store";
import {Auth} from "aws-amplify";
import {onError} from "lib/errors";

export default function useCheckAuth() {
  const [authenticating, setAuthenticating] = useState(true)
  const setAuthenticated = useStore(store => store.setAuthenticated)

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {
      await Auth.currentSession();
      setAuthenticated(true);
    } catch (e) {
      if (e !== "No current user") {
        onError(e);
      }
    }
    setAuthenticating(false);
  }

  return authenticating
}