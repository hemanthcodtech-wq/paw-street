import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import SafeScreen from '../components/SafeScreen';

export default function ChatBotScreen({ navigation }) {
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'bot',
      text: "Woof! 🐾 I'm PawBot, your AI Pet Care Assistant. Ask me anything about your pet's diet, puppy training, vaccines, or product recommendations!"
    }
  ]);
  const [inputText, setInputText] = useState('');

  const quickPrompts = [
    'How much food should I feed my puppy?',
    'What to do for dog tick prevention?',
    'Is chocolate bad for cats?',
    'Recommend top cat wet food'
  ];

  const handleSend = (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg = { id: Date.now().toString(), sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    setTimeout(() => {
      let botReply = "That's a wonderful question! Based on vet guidelines, consistent hydration, protein-rich diets, and routine exercise keep your pet vibrant and healthy. For specific symptoms, consult our verified home-visit vets in the Services tab!";
      const lower = query.toLowerCase();
      if (lower.includes('puppy') || lower.includes('food')) {
        botReply = "For growing puppies, feed 3-4 small meals daily with nutrient-dense puppy kibble like Royal Canin Mini or Pedigree Pro Puppy. Ensure fresh water is always available!";
      } else if (lower.includes('tick')) {
        botReply = "For ticks & fleas, use herbal tick shampoos (like Himalaya Erina-EP) alongside spot-on treatments recommended by our certified clinics in the Stores tab.";
      } else if (lower.includes('chocolate')) {
        botReply = "⚠️ CAUTION: Chocolate contains theobromine which is toxic to both cats and dogs! If ingested, reach out to an emergency vet right away.";
      }

      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: 'bot', text: botReply }]);
    }, 600);
  };

  return (
    <SafeScreen backgroundColor={colors.surface}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTitleGroup}>
          <Text style={styles.headerTitle}>PawBot Pet Assistant</Text>
          <View style={styles.onlineBadge}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>Instant AI Support</Text>
          </View>
        </View>
      </View>

      {/* Messages List */}
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        renderItem={({ item }) => (
          <View style={[styles.bubbleWrapper, item.sender === 'user' ? styles.userWrapper : styles.botWrapper]}>
            {item.sender === 'bot' && (
              <View style={styles.botAvatar}>
                <Ionicons name="paw" size={14} color="#FFF" />
              </View>
            )}
            <View style={[styles.bubble, item.sender === 'user' ? styles.userBubble : styles.botBubble]}>
              <Text style={[styles.msgText, item.sender === 'user' ? styles.userMsgText : styles.botMsgText]}>
                {item.text}
              </Text>
            </View>
          </View>
        )}
      />

      {/* Quick Prompts */}
      <View style={styles.promptsContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={quickPrompts}
          keyExtractor={(item, idx) => idx.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.promptChip} onPress={() => handleSend(item)}>
              <Text style={styles.promptText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Input Bar */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Type your pet care question..."
          placeholderTextColor={colors.textMuted}
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={() => handleSend()}>
          <Ionicons name="send" size={16} color="#FFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    gap: 12,
  },
  backBtn: {
    padding: 4,
  },
  headerTitleGroup: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  onlineText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
  },
  messagesList: {
    padding: 16,
    gap: 12,
  },
  bubbleWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 4,
  },
  botWrapper: {
    justifyContent: 'flex-start',
  },
  userWrapper: {
    justifyContent: 'flex-end',
  },
  botAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  botBubble: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  userBubble: {
    backgroundColor: colors.primaryDark,
    borderBottomRightRadius: 4,
  },
  msgText: {
    fontSize: 13,
    lineHeight: 18,
  },
  botMsgText: {
    color: colors.textPrimary,
  },
  userMsgText: {
    color: '#FFF',
    fontWeight: '600',
  },
  promptsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  promptChip: {
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  promptText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 13,
    color: colors.textPrimary,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

