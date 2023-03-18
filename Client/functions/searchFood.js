import {clientSearchMethods} from "../constants";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const portENV = process.env["PORT"];
const ip_addressENV = process.env["IP_ADDRESS"];
// For testing purposes
// Update this with your own UrlService
let ip_address = ip_addressENV;
let port= portENV


export async function genericSearch(value) {
    let url= `http://${ip_address}:${port}/api/food/${clientSearchMethods.genericSearch}.${value}`;

    let response;
    try {
        const {token } = JSON.parse(
            (await AsyncStorage.getItem('user'))
        );
        response = await axios.get(url,{
            headers: {
                authorization:token
        }});
    } catch (error) {
        if(axios.isAxiosError(error)){
            console.log(error.response);
        }else{
            console.log("Default error handler" + error);
        }
        return error;
    }
    return response.data;
}

export async function specificSearch(value) {
    let url= `http://${ip_address}:${port}/api/food/${clientSearchMethods.specificSearch}.${value}`;
    let response
    try {
        const {token } = JSON.parse(
            (await AsyncStorage.getItem('user'))
        );
        response = await axios.get(url,{
            headers: {
                authorization:token
        }});
    }
    catch (error) {
        if(axios.isAxiosError(error)){
            console.log(error.response);
        }else{
            console.log("Default error handler" + error);
        }
        return error;
    }

    return response.data;
}




