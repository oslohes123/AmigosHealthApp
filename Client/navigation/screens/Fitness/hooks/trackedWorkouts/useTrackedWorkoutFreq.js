/* eslint-disable consistent-return */
import { useState } from 'react';
import { useAuthContext } from '../../../Authentication/context/AuthContext';

const port = process.env.PORT;
const ipAddress = process.env.IP_ADDRESS;
const workoutFreqRoute = `http://${ipAddress}:${port}/api/user/completedWorkouts/workoutFreq`;

export default function useTrackedWorkoutFreq() {
  const [getErrorGetWorkoutFreq, setErrorGetWorkoutFreq] = useState(null);
  const [isLoadingGetWorkoutFreq, setIsLoadingGetWorkoutFreq] = useState(null);
  const { user } = useAuthContext();
  const userid = user.id;

  const getTrackedWorkoutFreq = async () => {
    setIsLoadingGetWorkoutFreq(true);
    setErrorGetWorkoutFreq(null);
    const response = await fetch(workoutFreqRoute, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', userid },
    });

    const getTrackedWorkoutFreqJSON = await response.json();
    if (!response.ok) {
      setIsLoadingGetWorkoutFreq(false);
      setErrorGetWorkoutFreq(getTrackedWorkoutFreqJSON.mssg);
      return [];
    }
    if (response.ok) {
      try {
        setIsLoadingGetWorkoutFreq(false);
        return {
          workoutNameLabels: getTrackedWorkoutFreqJSON.graphLabels,
          workoutNameData: getTrackedWorkoutFreqJSON.graphData,
        };
      } catch (error) {
        setErrorGetWorkoutFreq(error);
        setIsLoadingGetWorkoutFreq(false);
        return [];
      }
    }
  };

  return { getTrackedWorkoutFreq, isLoadingGetWorkoutFreq, getErrorGetWorkoutFreq };
}
