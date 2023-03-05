import { TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';

import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { globalStyles } from '../../styles/global';

const PasswordInput = ({
    value,
    onChange,
    label,
    showPassword,
    setShowPassword
}) => {
    return (
        <View>
            <TextInput
                style={styles.input}
                placeholder={label}
                secureTextEntry={!showPassword}
                value={value}
                onChangeText={onChange}
            />
            <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '8%', top: '35%' }}
            >
                <FontAwesome
                    name={showPassword ? 'eye-slash' : 'eye'}
                    size={24}
                    color="black"
                />
            </TouchableOpacity>
        </View>
    );
};

export default PasswordInput;

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        padding: 10,
        fontSize: 18,
        borderRadius: 20,
        width: '90%',
        alignSelf: 'center',
        margin: '5%'
      },
})
