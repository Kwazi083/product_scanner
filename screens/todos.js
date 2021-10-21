import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, StatusBar, FlatList, View, TouchableOpacity } from 'react-native';
import TodoInput from './todoInput';
import TodoItem from './todoItem';
import 'localstorage-polyfill';

const Todos = ({ navigation }) => {

    const [todoItems, setTodoItems] = useState([]);

    // save data in local storage
    const saveData = (newTodos) => {
        localStorage.setItem("todos", JSON.stringify(newTodos));
    };

    // load grocery list from local storage
    useEffect(() => {
        if (localStorage.getItem("todos")) {
            setTodoItems(JSON.parse(localStorage.getItem("todos")));
        }
    }, []);

    // Add a new item to the state
    function addTodoItem(_text) {
        setTodoItems([...todoItems, { text: _text, completed: false }]);
        saveData([...todoItems, { text: _text, completed: false }]);
    }

    // Delete an item from state by index
    function deleteTodoItem(_index) {
        let tempArr = [...todoItems];
        tempArr.splice(_index, 1);
        setTodoItems(tempArr)
    }

    // Function to set completed to true by index.
    function completeTodoItem(_index) {
        let tempArr = [...todoItems];
        tempArr[_index].completed = true;
        saveData(tempArr)
        setTodoItems(tempArr)
    }

    return (
        <>
            <SafeAreaView style={{ padding: 16, justifyContent: 'space-between', flex: 1 }}>
                <Text style={{ fontSize: 36, fontWeight: 'bold', marginBottom: 20, color: "blue" }}>Grocery List</Text>
                <FlatList
                    data={todoItems}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => {
                        return (
                            <TodoItem
                                item={item}
                                deleteFunction={() => deleteTodoItem(index)}
                                completeFunction={() => completeTodoItem(index)}
                            />
                        )
                    }}
                />
                <TodoInput onPress={addTodoItem} />
            </SafeAreaView>
        </>
    )
}

export default Todos;
