import React, { useState } from 'react';
import { View, SafeAreaView, StyleSheet, StatusBar, Text, Modal, TextInput, TouchableOpacity } from 'react-native';
import { MessageList } from '../components/MessageList';
import { InputArea } from '../components/InputArea';
import { sendMessageToJarvis } from '../services/api';
import { useJarvisStore } from '../store/jarvisStore';
import * as Speech from 'expo-speech';
import * as Linking from 'expo-linking';
import { Settings, X } from 'lucide-react-native';

export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { addMessage, addInsight, apiKey, setApiKey, userName, setUserName } = useJarvisStore();

  const handleSend = async (text: string) => {
    if (!apiKey) {
      setShowSettings(true);
      return;
    }

    const userMsg = { id: Date.now().toString(), role: 'user' as const, content: text, timestamp: Date.now() };
    addMessage(userMsg);
    setIsLoading(true);

    try {
      const data = await sendMessageToJarvis(text);

      const aiMsg = { id: (Date.now() + 1).toString(), role: 'assistant' as const, content: data.reply, timestamp: Date.now() };
      addMessage(aiMsg);

      // TTS
      Speech.speak(data.reply, { language: 'pt-BR', pitch: 0.9, rate: 1.0 });

      // Music Logic
      if (data.music) {
        Linking.openURL(`https://www.youtube.com/results?search_query=${encodeURIComponent(data.music)}`);
      }

      // Memory Logic
      if (data.memory) {
        // Simple auto-save for mobile or could add Alert.alert to confirm
        addInsight(data.memory);
      }

    } catch (error) {
      const errMsg = { id: Date.now().toString(), role: 'assistant' as const, content: "Erro de conexão.", timestamp: Date.now() };
      addMessage(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>JARVIS</Text>
        <TouchableOpacity onPress={() => setShowSettings(true)}>
          <Settings color="#71717a" size={24} />
        </TouchableOpacity>
      </View>

      <MessageList />
      <InputArea onSend={handleSend} isLoading={isLoading} />

      {/* Settings Modal */}
      <Modal visible={showSettings} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Configurações</Text>
              <TouchableOpacity onPress={() => setShowSettings(false)}>
                <X color="#fff" size={24} />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Groq API Key</Text>
            <TextInput
              style={styles.input}
              value={apiKey || ''}
              onChangeText={setApiKey}
              placeholder="gsk_..."
              placeholderTextColor="#555"
              secureTextEntry
            />

            <Text style={styles.label}>Seu Nome</Text>
            <TextInput
              style={styles.input}
              value={userName}
              onChangeText={setUserName}
              placeholderTextColor="#555"
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => setShowSettings(false)}
            >
              <Text style={styles.saveText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b', // zinc-950
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#27272a',
  },
  title: {
    color: '#06b6d4', // cyan-500
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#18181b',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  label: {
    color: '#a1a1aa',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#27272a',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3f3f46',
  },
  saveButton: {
    backgroundColor: '#0891b2',
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
