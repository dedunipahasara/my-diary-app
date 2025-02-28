import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Image,
    Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import ColorPicker from 'react-native-wheel-color-picker';

const fontFamilies = [
    'sans-serif',
    'serif',
    'monospace',
    'courier',
    'times-new-roman',
    'Arial',
    'Helvetica',
    'Verdana',
    'Georgia',
    'Palatino',
    'Garamond',
    'Comic Sans MS',
    'Impact',
    'Trebuchet MS',
];

const DiaryEntryScreen: React.FC = () => {
    const route = useRoute();
    const selectedDate = new Date(route?.params?.selectedDate || new Date());
    const editMode = route?.params?.editMode || false;

    const [note, setNote] = useState<string>('');
    const [cardColor, setCardColor] = useState<string>('#F37199');
    const [fontWeight, setFontWeight] = useState<'normal' | 'bold'>('normal');
    const [fontStyle, setFontStyle] = useState<'normal' | 'italic'>('normal');
    const [fontFamily, setFontFamily] = useState<string>('sans-serif');
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [showInput, setShowInput] = useState<boolean>(editMode);
    const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
    const [showFontPicker, setShowFontPicker] = useState<boolean>(false);
    const [fontSize, setFontSize] = useState<number>(18); // Default font size

    useEffect(() => {
        const requestPermissions = async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Sorry, we need camera roll permissions to make this work!');
            }
        };

        requestPermissions();

        if (editMode) {
            loadExistingNote();
        }
    }, [editMode]);

    const loadExistingNote = async () => {
        try {
            const dateKey = selectedDate.toISOString().split('T')[0];
            const storedNote = await AsyncStorage.getItem(dateKey);
            if (storedNote) {
                const noteData = JSON.parse(storedNote);
                setNote(noteData.note);
                setCardColor(noteData.cardColor);
                setFontWeight(noteData.fontWeight);
                setFontStyle(noteData.fontStyle);
                setFontFamily(noteData.fontFamily);
                setImageUri(noteData.imageUri);
            }
        } catch (error) {
            console.error('Error loading existing note:', error);
        }
    };

    const saveNote = async () => {
        try {
            const dateKey = selectedDate.toISOString().split('T')[0];
            const noteData = { note, cardColor, fontWeight, fontStyle, fontFamily, imageUri };
            await AsyncStorage.setItem(dateKey, JSON.stringify(noteData));
            Alert.alert('Saved Edited Note 😊', 'Your note has been saved.');
            if (editMode) {
                setNote(''); // Clear note after edit and save
                setImageUri(null);
                setShowInput(false); // Hide input after edit and save
            } else {
                setNote('');
                setImageUri(null);
                setShowInput(false);
                setShowColorPicker(false);
            }
        } catch (error) {
            console.error('Error saving note:', error);
            Alert.alert('Error', 'Failed to save note.');
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled && result.assets && result.assets.length > 0) {
            setImageUri(result.assets[0].uri);
        }
    };

    const handleFontSizeChange = (newFontSize: number) => {
        if (newFontSize > 0) {
            setFontSize(newFontSize); // Only update if it's a valid positive number
        } else {
            console.error('Invalid font size:', newFontSize);
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.dateText}>{selectedDate.toDateString()}</Text>

                {showInput && (
                    <Card style={[styles.card, { backgroundColor: cardColor }]}>
                        <TextInput
                            style={[styles.input, { fontWeight, fontStyle, fontFamily, fontSize, color: '#FFFFFF' }]}
                            multiline
                            placeholder="Write your thoughts here..."
                            placeholderTextColor="#FFFFFF"
                            value={note}
                            onChangeText={setNote}
                        />
                        {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
                    </Card>
                )}

                {/* Controls Row */}
                {showInput && (
                    <View style={styles.controlsContainer}>
                        <TouchableOpacity onPress={() => setFontWeight(fontWeight === 'normal' ? 'bold' : 'normal')}>
                            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>B</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setFontStyle(fontStyle === 'normal' ? 'italic' : 'normal')}>
                            <Text style={{ fontStyle: 'italic', fontSize: 18 }}>I</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={pickImage}>
                            <Ionicons name="image-outline" size={24} color="black" />
                        </TouchableOpacity>

                        {/* Font Family Picker Icon */}
                        <TouchableOpacity onPress={() => setShowFontPicker(!showFontPicker)}>
                            <Ionicons name="text-outline" size={24} color="black" />
                        </TouchableOpacity>

                        {/* Color Picker Icon */}
                        <TouchableOpacity onPress={() => setShowColorPicker(!showColorPicker)}>
                            <Ionicons name="color-palette-outline" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                )}

                {/* Color Picker toggle */}
                {showColorPicker && (
                    <View>
                        <ColorPicker
                            color={cardColor}
                            onColorChangeComplete={setCardColor}
                            thumbSize={30}
                            sliderSize={30}
                        />
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setShowColorPicker(false)}
                        >
                            <Ionicons name="close" size={30} color="black" />
                        </TouchableOpacity>
                    </View>
                )}

                {/* Font Family Picker toggle */}
                {showFontPicker && (
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={fontFamily}
                            onValueChange={setFontFamily}
                            style={styles.picker}
                        >
                            {fontFamilies.map((font, index) => (
                                <Picker.Item key={index} label={font} value={font} />
                            ))}
                        </Picker>
                    </View>
                )}
            </ScrollView>

            {/* Floating Action Button (plus/close) */}
            <View style={styles.bottomButtonsContainer}>
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => setShowInput(!showInput)}>
                    <Ionicons name={showInput ? 'close' : 'add'} size={30} color="white" />
                </TouchableOpacity>

                {/* Save Button */}
                {showInput && (
                    <TouchableOpacity style={styles.saveButton} onPress={saveNote}>
                        <Ionicons name="checkmark" size={30} color="white" />
                    </TouchableOpacity>
                )}
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '' },
    scrollContainer: { padding: 20, paddingBottom: 100 },
    dateText: { fontSize: 22, textAlign: 'center', marginBottom: 15, fontWeight: 'bold', color: '#333' },
    card: { padding: 15, marginBottom: 15, borderRadius: 10, elevation: 3 },
    input: { fontSize: 18, minHeight: 150, textAlignVertical: 'top', padding: 10 },
    image: { width: '100%', height: 200, borderRadius: 10, marginTop: 10 },
    controlsContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginVertical: 10 },
    picker: { height: 50, width: 150 },
    pickerContainer: { marginVertical: 10 },
    bottomButtonsContainer: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingBottom: 10,
    },
    fab: { backgroundColor: '#F37199', borderRadius: 50, padding: 15, marginRight: 10 },
    saveButton: { backgroundColor: '#28a745', padding: 15, borderRadius: 50 },
    closeButton: { position: 'absolute', top: 20, right: 20, backgroundColor: '#fff', borderRadius: 50, padding: 10 },
});

export default DiaryEntryScreen;
