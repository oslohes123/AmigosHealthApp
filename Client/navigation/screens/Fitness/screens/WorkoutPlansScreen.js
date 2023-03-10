import { StatusBar } from 'expo-status-bar';

import { Text, View, SafeAreaView, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useState, useContext, useEffect } from 'react';
import themeContext from '../../../theme/themeContext';
import SearchBar from '../../../components/SearchBar';
import GreenButton from '../../../components/GreenButton';
import { useGetAllWorkoutNames } from '../hooks/useGetAllWorkoutNames';
import { useGetWorkoutDetails } from '../hooks/useGetWorkoutDetails';

export default function WorkoutPlansScreen({ navigation }) {
    const theme = useContext(themeContext)
    const { getAllWorkoutNames } = useGetAllWorkoutNames();
    const [results, setResults] = useState([])
    const [workoutDetails, setWorkoutDetails] = useState([])
    const { getWorkoutDetails, isLoading, error } = useGetWorkoutDetails();
    
    useEffect(() => {
        async function fetchData() {
            const data = await getAllWorkoutNames();
            console.log(`data: ${JSON.stringify(data)}`);
            let resultsList = [];

            data.map((item) => {
                resultsList.push(item);
            });
            setResults(resultsList);
        }
        fetchData()
    }, [])  
    

    async function fetchWorkoutDetails(item) {
        const data = await getWorkoutDetails(item)
        console.log(`workout data: ${data}`)
        setWorkoutDetails(data.workoutToReturn)
    }

    return (
        <SafeAreaView style={[styles.container, {backgroundColor: theme.background}]}>

            {/* <View style={styles.searchAndCreate}>

                {SearchBar({themeColor: theme.color, width: screenWidth * 0.7})}

            </View> */}

            <Text style={[styles.customWorkout, {color: theme.color}]}>Custom Workouts</Text>
        
            <ScrollView style={[styles.scrollView, {borderColor: theme.color}]} showsVerticalScrollIndicator={false} bounces={false} alignItems={'center'}>

                {error && <Text>{error}</Text>}
                {(results.length < 1) && <Text>You currently have no custom workout plans.</Text>}
                
                {results && results.map((item) => (
                    <TouchableOpacity key={item} onPress={() => {
                        fetchWorkoutDetails(item)
                        navigation.navigate("Workout Plan Information", workoutDetails)
                    }}> 
                        <Text style={[styles.testText, {borderColor: theme.color, color: theme.color}]} key={item}>{item}</Text>
                    </TouchableOpacity>
                ))}

            </ScrollView>
            <View style={{padding: 10}}>
                {GreenButton({height: screenHeight * 0.05, width: screenWidth * 0.15, fontSize: 20, text: "+", buttonFunction: () => {navigation.navigate('Create New Workout')}})}
            </View>
            <StatusBar style="auto" />
        </SafeAreaView>
    );
}

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const styles = {
    customWorkout: {
        fontSize: 22,
        margin: 10,
        fontWeight: "bold",
    },
    testText: {
        fontSize: 32,
        padding: 5,
        borderRadius: 20,
        margin: 5,
        borderWidth: 1,
        textAlign: 'center',
    },
    scrollView: {
        height: screenHeight * 0.2,
        borderWidth: 2,
        borderRadius: 26,
        paddingHorizontal: 16,
        marginHorizontal: 10,
        width: screenWidth * 0.9
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        padding: 40,
    },
    searchAndCreate: {
        flexDirection: 'row',
        padding: 12,
        justifyContent: 'space-evenly'
    },
    textInput: {
        borderWidth: 1,
        padding: 10,
        marginHorizontal: 12,
        flex: 1,
    },
    container: {
        alignItems: 'center',
        flex: 1
    },
}

const modalStyle = {
    modalMain: {
        justifyContent: 'space-between', 
        alignItems:'center', 
        height: screenHeight * 0.8, 
        width: screenWidth * 0.9, 
        borderRadius: 26, 
        padding: 20,
        borderWidth: 3
    },
    modalText: {
        fontSize: 30,
        textAlign: 'center', 
        fontWeight: 'bold', 
    },
    textInput: { 
        borderRadius: 10, 
        borderWidth: 1, 
        width: screenWidth * 0.35, 
        height: screenHeight * 0.05,
        fontWeight: 'bold'
    },
}
