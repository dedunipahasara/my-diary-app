import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity, Alert, Image } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const HomeScreen: React.FC = () => {
    const navigation = useNavigation();
    const [savedEntries, setSavedEntries] = useState<{ date: string; note: string }[]>([]);
    const [markedDates, setMarkedDates] = useState<any>({});

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'My Diary',
            headerStyle: { backgroundColor: '#ff6b81' },
            headerTintColor: '#ffffff',
            headerTitleStyle: { fontSize: 22, fontWeight: 'bold' },
        });
    }, [navigation]);

    useEffect(() => {
        const loadSavedEntries = async () => {
            try {
                const keys = await AsyncStorage.getAllKeys();
                const entries = await AsyncStorage.multiGet(keys);
                const formattedEntries = entries
                    .map(([date, value]) => ({
                        date,
                        note: value ? JSON.parse(value).note : ''
                    }))
                    .filter(entry => entry.date);
                setSavedEntries(formattedEntries);

                const marks: any = {};
                formattedEntries.forEach((entry) => {
                    marks[entry.date] = {
                        marked: true,
                        dotColor: '#ff6b81',
                        textColor: 'white',
                        activeOpacity: 0,
                    };
                });
                setMarkedDates(marks);
            } catch (error) {
                console.error('Error loading saved entries:', error);
            }
        };
        loadSavedEntries();
    }, []);

    const onDayPress = (day: DateData) => {
        navigation.navigate('DiaryEntry', { selectedDate: day.dateString });
    };

    const editEntry = (date: string) => {
        navigation.navigate('DiaryEntry', { selectedDate: date, editMode: true });
    };

    const deleteEntry = async (date: string) => {
        Alert.alert(
            "Delete Entry",
            "Are you sure you want to delete this entry?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: async () => {
                        try {
                            await AsyncStorage.removeItem(date);
                            setSavedEntries(prevEntries => prevEntries.filter(entry => entry.date !== date));
                            setMarkedDates(prevMarks => {
                                const updatedMarks = { ...prevMarks };
                                delete updatedMarks[date];
                                return updatedMarks;
                            });
                        } catch (error) {
                            console.error('Error deleting entry:', error);
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Image source={require('../assets/cô_bé_ngắm_sao-removebg-preview.png')} style={styles.backgroundImage} />

            <Text style={styles.screenTitle}>Welcome to Your Diary</Text>

            {/* Glassmorphic Card for the Calendar */}
            <View style={styles.glassCard}>
                <BlurView intensity={10} style={styles.blurContainer}>
                    <Calendar
                        onDayPress={onDayPress}
                        style={styles.calendar}
                        theme={{
                            todayTextColor: '#ff6b81',
                            arrowColor: '#ff6b81',
                            textSectionTitleColor: '#333',
                            calendarBackground: 'transparent',
                        }}
                        markedDates={markedDates}
                    />
                </BlurView>
            </View>

            <FlatList
                data={savedEntries}
                keyExtractor={(item) => item.date}
                renderItem={({ item }) => (
                    <View style={styles.entryContainer}>
                        <TouchableOpacity style={styles.entryTouchable} onPress={() => editEntry(item.date)}>
                            <Card style={styles.entryCard}>
                                <Text style={styles.entryText}>
                                    {item.date}: {item.note ? item.note.substring(0, 50) : 'No note available'}...
                                </Text>
                            </Card>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.deleteIcon} onPress={() => deleteEntry(item.date)}>
                            <Ionicons name="trash-outline" size={24} color="red" />
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    backgroundImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
        opacity: 0.3,
        top: '-18%', // Move the image up by 10% of its height
    },
    screenTitle: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 15, color: '#ff4757' },

    // Glassmorphic Calendar Card
    glassCard: {
        borderRadius: 15,
        overflow: 'hidden',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 3,
        borderColor: '#F37199'
    },
    blurContainer: {
        padding: 8,
    },
    calendar: { borderRadius: 10 },

    // Diary Entries
    entryContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
    entryTouchable: { flex: 1 },
    entryCard: { padding: 15, borderRadius: 15, elevation: 3, backgroundColor: 'rgba(255, 235, 235, 0.8)' },
    entryText: { fontSize: 16, color: '#333' },
    deleteIcon: { padding: 10 },
});

export default HomeScreen;