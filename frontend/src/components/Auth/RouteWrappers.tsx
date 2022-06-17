import React, {cloneElement} from "react";
import { Navigate, useLocation } from "react-router-dom";
import useStore from 'store'

export function AuthenticatedRoute({ children }: React.PropsWithChildren<never>) {
  const { pathname, search } = useLocation();
  const authenticated = useStore(store => store.authenticated)

  if (!authenticated) {
    return <Navigate to={`/login?redirect=${pathname}${search}`} />;
  }

  return children;
}

function querystring(name: string, url: string = window.location.href) {
  const parsedName = name.replace(/[[]]/g, "\\$&");
  const regex = new RegExp(`[?&]${parsedName}(=([^&#]*)|&|#|$)`, "i");
  const results = regex.exec(url);

  if (!results || !results[2]) {
    return false;
  }

  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

export function UnauthenticatedRoute(props: React.PropsWithChildren<any>) {
  const authenticated = useStore(store => store.authenticated)
  const { children } = props;
  const redirect = querystring("redirect");

  if (authenticated) {
    return <Navigate to={redirect || "/"} />;
  }

  return cloneElement(children, props);
}
