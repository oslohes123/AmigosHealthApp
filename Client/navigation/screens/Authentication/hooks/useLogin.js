import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
const serverURL = process.env.URL;
// const dotenv = require("dotenv");
// dotenv.config();
const port = process.env["PORT"];
const ipAddress = process.env["IP_ADDRESS"];

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  console.log(`port: `);
  console.log(`ipAddress: `);

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    console.log("In login");
    console.log(`Port in login: `);
    console.log(`ipAddress in login: `);

    const response = await fetch(
      `${serverURL}/api/user/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    const json = await response.json();
    console.log(json);
    if (!response.ok) {
      setIsLoading(false);
      setError(json.mssg);
      console.log(error);
    }
    if (response.ok) {
      try {
        //sets user properties from API to 'user' in AsyncStorage, so it can 'remember' a user
        await AsyncStorage.setItem("user", JSON.stringify(json));
        console.log(json);

        dispatch({ type: "LOGIN", payload: json });

        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
        console.error(error);
      }
    }
  };

  return { login, isLoading, error };
};
