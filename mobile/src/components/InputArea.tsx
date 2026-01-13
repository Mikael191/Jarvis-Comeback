import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Mic, Send, StopCircle } from 'lucide-react-native';

interface InputAreaProps {
  onSend: (text: string) => void;
  isLoading: boolean;
}

export function InputArea({ onSend, isLoading }: InputAreaProps) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim() && !isLoading) {
      onSend(text);
      setText('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Converse com JARVIS..."
          placeholderTextColor="#71717a"
          multiline
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleSend}
        disabled={isLoading || !text.trim()}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Send size={24} color={text.trim() ? "#06b6d4" : "#52525b"} />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: 'rgba(24, 24, 27, 0.9)', // zinc-900
    borderTopWidth: 1,
    borderTopColor: '#27272a',
    alignItems: 'flex-end',
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: '#27272a',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    minHeight: 48,
    justifyContent: 'center',
  },
  input: {
    color: '#fff',
    fontSize: 16,
    maxHeight: 100,
  },
  button: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    backgroundColor: '#27272a',
  },
});
