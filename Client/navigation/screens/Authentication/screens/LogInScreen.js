import { SafeAreaView, Button } from 'react-native'
import React from 'react'
import { formikLoginForm } from '../forms/loginForm'

export default function LogInScreen({ navigation }) {
    return (
        <>
            {formikLoginForm()}
            <SafeAreaView style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                <Button title={"Sign Up"} onPress={() => {
                    console.log("go to sign up screen.");
                    navigation.navigate("Sign Up");
                }} />
            </SafeAreaView>
        </>
    )
}