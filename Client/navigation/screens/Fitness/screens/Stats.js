import { View, StyleSheet, Text, TouchableOpacity, Modal } from "react-native";
import React, { useEffect, useState } from "react";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { useGetAllExercises } from "../hooks/exercise/useGetAllExercises";
import { useIsFocused } from "@react-navigation/native";
import { FAB } from "react-native-paper";
import { useGetExerciseHistory } from "../hooks/exercise/useGetExerciseHistory";
export default function Stats({ navigation }) {
  const [selected, setSelected] = useState("");
  const [visible, setVisible] = useState(false);
  const [getArrayOfExercises, setArrayOfExercises] = useState([]);
  const [getWeightedLabels, setWeightedLabels] = useState(null);
  const [getWeightedData, setWeightedData] = useState(null);
  const { getAllExercises, isLoading, error } = useGetAllExercises();
  const { getExerciseHistory } = useGetExerciseHistory();
  const isFocused = useIsFocused();

  // const data = {
  //   labels: ["January", "February", "March", "April", "May", "June"],
  //   datasets: [
  //     {
  //       data: [20, 45, 28, 80, 99, 43],
  //       strokeWidth: 2, // optional
  //     },
  //   ],
  // };
  // const data = {
  //   labels: getLabels,
  //   datasets: [
  //     {
  //       data: getData,
  //       color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // optional
  //       strokeWidth: 2, // optional
  //     },
  //   ],
  // };

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
  const setAllExercises = async () => {
    setArrayOfExercises(await getAllExercises());
  };

  useEffect(() => {
    const setDataAndLabels = async () => {
      const result = await getExerciseHistory(selected);
      if (result) {
        const { data, labels, type } = result;

        if (type === "Weight") {
          setWeightedData(data);
          setWeightedLabels(labels);
        }
      }
    };
    setDataAndLabels();
  }, [selected]);

  useEffect(() => {
    if (isFocused) {
      setAllExercises();
    }
  }, [navigation, isFocused]);

  const screenWidth = Dimensions.get("window").width;

  const chartConfig = {
    backgroundGradientFrom: "white",
    //backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "blue",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  };

  return (
    <View style={styles.container}>
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
      <View style={{ alignItems: 'center'}}>
        {/* This is the WeightedGraph */}
        {getWeightedData && getWeightedLabels && (
          <LineChart
          style={{borderRadius: 25}}
            data={weightedData}
            width={0.8 * screenWidth}
            height={220}
            chartConfig={chartConfig}
          />
        )}
      </View>
    </View>
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
});
