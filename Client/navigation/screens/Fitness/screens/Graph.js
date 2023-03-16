import { View, StyleSheet, Text, TouchableOpacity, Modal } from "react-native";
import React, { useEffect, useState } from "react";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { useGetAllExercises } from "../hooks/exercise/useGetAllExercises";
import { useIsFocused } from "@react-navigation/native";
import { FAB } from "react-native-paper";
import { useGetExerciseHistory } from "../hooks/exercise/useGetExerciseHistory";
import { ScrollView } from "react-native-gesture-handler";
import { ActivityIndicator, MD2Colors } from "react-native-paper";

export default function Graph({ navigation }) {
  const [selected, setSelected] = useState("");
  const [visible, setVisible] = useState(false);
  const [getArrayOfExercises, setArrayOfExercises] = useState([]);
  const [getWeightedLabels, setWeightedLabels] = useState(null);
  const [getWeightedData, setWeightedData] = useState(null);

  const [getDurationLabels, setDurationLabels] = useState(null);
  const [getDurationData, setDurationData] = useState(null);
  const [getDistanceLabels, setDistanceLabels] = useState(null);
  const [getDistanceData, setDistanceData] = useState(null);

  const [getCaloriesLabels, setCaloriesLabels] = useState(null);
  const [getCaloriesData, setCaloriesData] = useState(null);

  const { getAllExercises } = useGetAllExercises();
  const { getExerciseHistory, isLoading } = useGetExerciseHistory();
  const isFocused = useIsFocused();

  const weightedData = {
    labels: getWeightedLabels,
    datasets: [
      {
        data: getWeightedData,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // optional
        strokeWidth: 2, // optional
      },
    ],
  };

  const durationData = {
    labels: getDurationLabels,
    datasets: [
      {
        data: getDurationData,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // optional
        strokeWidth: 2, // optional
      },
    ],
    // legend: ["Duration"],
  };

  const caloriesData = {
    labels: getCaloriesLabels,
    datasets: [
      {
        data: getCaloriesData,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // optional
        strokeWidth: 2, // optional
      },
    ],
    // legend: ["Calories"],
  };
  const distanceData = {
    labels: getDistanceLabels,
    datasets: [
      {
        data: getDistanceData,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // optional
        strokeWidth: 2, // optional
      },
    ],
    // legend: ["Distance"],
  };
  const setAllExercises = async () => {
    setArrayOfExercises(await getAllExercises());
  };

  useEffect(() => {
    const setDataAndLabels = async () => {
      setDurationData(null);
      setWeightedData(null);
      setDistanceData(null);
      setCaloriesData(null);

      const result = await getExerciseHistory(selected);
      if (result) {
        //Look into have one state that manages labels as they all have the same labels
        const { labels, type, data } = result;

        if (type === "Weight") {
          setWeightedData(data.arrayOfWeightPulled);
          setWeightedLabels(labels);
          console.log(`getWeightedData in useEffect:${getWeightedData}`);
          console.log(`getWeightedLabels in useEffect:${getWeightedLabels}`);
        } else if (type === "Other") {
          setDurationData(data.arrayOfDuration);
          setDurationLabels(labels);

          setDistanceData(data.arrayOfDistance);
          setDistanceLabels(labels);

          setCaloriesData(data.arrayOfCalories);
          setCaloriesLabels(labels);
        }
      }
    };
    setDataAndLabels();
    console.log(`getWeightedData:${getWeightedData}`);
    console.log(`getWeightedLabels:${getWeightedLabels}`);
  }, [selected]);

  useEffect(() => {
    if (isFocused) {
      setAllExercises();
    }
  }, [navigation, isFocused]);

  const screenWidth = Dimensions.get("window").width * 0.95;

  const chartConfig = {
    backgroundGradientFrom: "white",
    //backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#0040ff",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.modalContainer}>
        <View style={styles.dropDownContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setVisible(true)}
          >
            <Text>{selected || "Select a Workout"}</Text>
          </TouchableOpacity>
          <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            onRequestClose={() => setVisible(false)}
          >
            <View style={styles.modal}>
              {!getArrayOfExercises && (
                <Text>You Haven't Performed Any Exercises Yet!</Text>
              )}
              {getArrayOfExercises &&
                getArrayOfExercises.map((exercise) => (
                  <TouchableOpacity
                    style={styles.modalButton}
                    key={exercise}
                    onPress={() => {
                      setSelected(exercise);
                      setVisible(false);
                    }}
                  >
                    <Text>{exercise}</Text>
                  </TouchableOpacity>
                ))}

              <FAB
                icon="close"
                style={styles.fab}
                // label="Create Plan"
                onPress={() => {
                  setVisible(!visible);
                }}
              />
            </View>
          </Modal>
        </View>
      </View>

      {isLoading && (
        <>
          {/* <Text>Refreshing.....</Text> */}
          <ActivityIndicator
            animating={true}
            size={50}
            color={MD2Colors.lightBlue400}
          />
        </>
      )}
      <View style={{ alignItems: "center" }}>
        {/* This is the WeightedGraph */}

        {getWeightedData && getWeightedLabels && (
          <View style={{ marginBottom: 40 }}>
            <Text style={[styles.title]}>Weight pulled per exercise</Text>
            <LineChart
              // style={{ borderRadius: 25 }}
              data={weightedData}
              width={screenWidth}
              height={220}
              yAxisSuffix={` kg`}
              chartConfig={chartConfig}
              bezier
              fromZero={true}
            />
          </View>
        )}

        {/* This is the duration graph for an Other exercise */}
        {getDurationData && getDurationLabels && (
          <View style={{ marginBottom: 40 }}>
            <Text style={[styles.title]}>Duration</Text>
            <LineChart
              style={{ borderRadius: 25 }}
              data={durationData}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              fromZero={true}
              bezier
              yAxisSuffix={` min`}
            />
          </View>
        )}

        {/* This is the distance graph for an Other exercise */}
        {getDistanceData && getDistanceLabels && (
          <View style={{ marginBottom: 40 }}>
            <Text style={[styles.title]}>Distance</Text>
            <LineChart
              style={{ borderRadius: 25 }}
              data={distanceData}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              fromZero={true}
              bezier
              yAxisSuffix={` m`}
            />
          </View>
        )}

        {/* This is the calories graph for an Other exercise */}
        {getCaloriesData && getCaloriesLabels && (
          <View style={{ marginBottom: 40 }}>
            <Text style={[styles.title]}>Calories</Text>
            <LineChart
              style={{ borderRadius: 25 }}
              data={caloriesData}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              fromZero={true}
              bezier
              yAxisSuffix={" kcal"}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#203038",
    flex: 1,
  },
  modalContainer: {
    alignItems: "center",
    marginVertical: "15%",
    width: "100%",
  },
  dropDownContainer: {
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 15,
    overflow: "hidden",
    marginRight: "5%",
    width: "50%",
  },
  button: {
    height: 40,
    justifyContent: "center",
    paddingLeft: 10,
    backgroundColor: "white",
  },
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalButton: {
    backgroundColor: "white",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
  },

  title: {
    color: "white",
    alignSelf: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});
