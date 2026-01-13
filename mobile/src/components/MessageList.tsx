import React, { useRef, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { useJarvisStore } from '../store/jarvisStore';

export function MessageList() {
  const { messages } = useJarvisStore();
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    if (messages.length > 0) {
      listRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <FlatList
      ref={listRef}
      data={messages}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <View style={[
          styles.bubble,
          item.role === 'user' ? styles.userBubble : styles.jarvisBubble
        ]}>
          <Text style={[
            styles.text,
            item.role === 'user' ? styles.userText : styles.jarvisText
          ]}>
            {item.content}
          </Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
  bubble: {
    padding: 12,
    borderRadius: 16,
    maxWidth: '85%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#27272a', // zinc-800
    borderTopRightRadius: 4,
  },
  jarvisBubble: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(8, 145, 178, 0.2)', // cyan-900/20
    borderTopLeftRadius: 4,
    borderColor: 'rgba(8, 145, 178, 0.3)',
    borderWidth: 1,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
  userText: {
    color: '#f4f4f5', // zinc-100
  },
  jarvisText: {
    color: '#cffafe', // cyan-50
  },
});
