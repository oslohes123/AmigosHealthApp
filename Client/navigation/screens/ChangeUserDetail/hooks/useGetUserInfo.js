import { useState } from 'react';
import { useAuthContext } from '../../Authentication/context/AuthContext';
import { useLogout } from '../../Authentication/hooks/useLogOut';

const serverURL = process.env.URL;

const usingDeployedServer = process.env.USING_DEPLOYED_SERVER;
const partialGetUserInfoRoute = '/api/user/getInfo';
let getUserInfoRoute;
if (usingDeployedServer) {
  getUserInfoRoute = `${serverURL}${partialGetUserInfoRoute}`;
} else {
  getUserInfoRoute = `http://localhost:3001${partialGetUserInfoRoute}`;
}
export default function useGetUserInfo() {
  const { user } = useAuthContext();
  console.log(`user: ${JSON.stringify(user)}`);
  const [errorUserInfo, setError] = useState(null);
  const [isLoadingUserInfo, setIsLoading] = useState(null);
  const { email, token } = user;
  const { logout } = useLogout();

  async function getUserInfo() {
    // console.log(`full getUserInfo user: ${JSON.stringify(user)}`);
    setIsLoading(true);
    setError(null);

    const response = await fetch(
      getUserInfoRoute,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
          email,
        },
      },
    );
    console.log(JSON.stringify(response));
    if (!response.ok) {
      if (response.status === 401) { logout(); }
      console.log(`response of getUserInfo: ${JSON.stringify(response)}`);
      setIsLoading(false);
      setError('Not Available');
      return null;
    } if (response.ok) {
      setIsLoading(false);
      const responseJSON = await response.json();
      return responseJSON;
    }
  }
  return { getUserInfo, isLoadingUserInfo, errorUserInfo };
}
