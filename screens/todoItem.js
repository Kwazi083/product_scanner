import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

export default function TodoItem(props) {

    // Update style according to props
    let style = props.item.completed ? {
        textDecorationLine: 'line-through'
    } : {
        textDecorationLine: 'none'
    }

    return (
        <TouchableOpacity
            onPress={() => props.completeFunction()}
            style={{ paddingVertical: 8, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={[{ fontSize: 18 }, style]}>{props.item.text}</Text>

            <TouchableOpacity
                style={{ padding: 8, backgroundColor: '#fc2c03', justifyContent: 'center', alignItems: 'center', borderRadius: 8 }}
                onPress={() => props.deleteFunction()}>

                <Text style={{ color: '#fafafa' }}>X</Text>

            </TouchableOpacity>

        </TouchableOpacity>
    );
}