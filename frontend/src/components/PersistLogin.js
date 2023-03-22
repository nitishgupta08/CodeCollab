import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";

const PersistLogin = () => {
  const { auth } = useAuth();

  return <>{auth ? <Outlet /> : null}</>;
};

export default PersistLogin;
