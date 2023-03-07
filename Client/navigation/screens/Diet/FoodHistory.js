import React, { useState } from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars'
import { date } from 'yup';
import { AntDesign } from '@expo/vector-icons'; 

export default function FoodHistory() {

  const[viewCalendar, setViewCalendar] = useState(false);
  const[selectDay, setSelectDay] = useState(null);
  const[food, setFood] = useState('');

  const toggleCalendar = () => {
    setViewCalendar(!viewCalendar);
  }

  const handleDayPress = (day) => {
    setSelectDay(day.dateString);
    console.log('selected day', day);
    setViewCalendar(false);
    setFood(getFood(day.dateString));
  }

  const getFood = (dateString) => {
    if (dateString === '2023-03-02') {
      return 'Apple';
    } else if (dateString === '2023-03-03') {
      return 'Banana';
    } else if (dateString === '2023-03-04') {
      return 'Orange';
    } else {
      return 'No food item consumed on this day';
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.icon} onPress={toggleCalendar}>
        <AntDesign name="calendar" size={35} color="white" />
      </TouchableOpacity>
      <View style={styles.primary}>
        {selectDay && (
          <Text style={styles.text}>{selectDay}</Text>
        )}
      </View>
      {viewCalendar && (
        <Calendar
        style={{width: '90%', alignSelf: 'center'}}
        onVisibleMonthsChange={(months) => {console.log('now these months are visible', months);}}
        onDayPress={handleDayPress}
        maxDate={new Date()}
        />
      )}
        {!viewCalendar && food !== '' && (
          <Text style={styles.foodText}>{food}</Text>
        )}
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#203038',
      flex: 1,
    },
    // header: {
    //   //width: 300,
    //   fontSize: 30,
    //   fontWeight: 'bold',
    //   marginTop: 30,
    //   color: 'white',
    //   alignSelf: 'center',
    //   },
    primary: {
      flexDirection:'row', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      marginHorizontal: '10%',
      marginVertical: '5%',
    },
    text: {
      fontSize: 20,
      color: 'white',
      fontWeight: 'bold',
      //backgroundColor: 'white',
      padding: 10,
      borderRadius: 15,
      borderWidth: 1,
      borderColor: 'white'
    },
    foodText: {
      fontSize: 20,
      color: 'white',
      fontWeight: 'bold',
      //backgroundColor: 'white',
      padding: 10,
      borderRadius: 15,
      borderWidth: 1,
      borderColor: 'white',
      alignSelf: 'center'
    },
    icon: {
      alignSelf: 'flex-end',
      margin: '5%'
    }
})

