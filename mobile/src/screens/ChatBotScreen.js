import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing } from '../theme/colors';

const PROMPT_CHIPS = [
  '🐶 Can my dog eat boiled chicken & rice?',
  '🛁 How often should I bathe my puppy?',
  '💊 Best tick & flea prevention routine',
  '🚨 What are common pet emergency signs?'
];

const INITIAL_MESSAGES = [
  {
    id: 'm-1',
    sender: 'bot',
    text: 'Hello pet parent! 🐾 I am your 24/7 Paw Street AI Pet Health Assistant. Ask me anything about nutrition, grooming schedules, emergency vet care, or puppy training!'
  }
];

export default function ChatBotScreen({ navigation }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef();

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages, isTyping]);

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query.trim()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // AI Response Simulation with realistic pet care knowledge
    setTimeout(() => {
      let replyText = 'That is a great question! For regular care, prioritize balanced nutrition, clean fresh drinking water, and timely vaccinations. If symptoms persist beyond 24 hours, consult a verified vet immediately.';

      const lower = query.toLowerCase();
      if (lower.includes('chicken') || lower.includes('rice') || lower.includes('eat') || lower.includes('food')) {
        replyText = 'Yes! Plain boiled boneless chicken and white rice is gentle on a dog\'s stomach, especially for an upset digestion. Ensure no onions, garlic, oil, or spices are added!';
      } else if (lower.includes('bathe') || lower.includes('bath') || lower.includes('shampoo')) {
        replyText = 'For most dogs, bathing once every 2 to 3 weeks with a gentle pH-balanced pet shampoo (like neem or oatmeal) is ideal. Over-bathing can strip their natural coat oils.';
      } else if (lower.includes('tick') || lower.includes('flea') || lower.includes('medicine')) {
        replyText = 'For tick & flea protection, veterinarian-approved chewables (like Bravecto or NexGard) or topical spot-on solutions give strong defense. Check paw pads and ears after park walks.';
      } else if (lower.includes('emergency') || lower.includes('sign') || lower.includes('sick')) {
        replyText = '🚨 Key pet emergency signs:\n• Continuous vomiting or retching\n• Pale gums or difficulty breathing\n• Ingestion of chocolate, grapes, or toxic plants\n• Sudden lethargy or inability to stand\n\nCall our 24/7 Emergency Line immediately if you notice these!';
      }

      const botMsg = {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: replyText
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.botProfile}>
          <View style={styles.botAvatar}>
            <Text style={{ fontSize: 20 }}>🤖</Text>
          </View>
          <View>
            <Text style={styles.botName}>Paw AI Vet Assistant</Text>
            <View style={styles.onlineRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Online • 24/7 Pet Care</Text>
            </View>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.messagesScroll}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((m) => (
            <View
              key={m.id}
              style={[
                styles.bubble,
                m.sender === 'user' ? styles.userBubble : styles.botBubble
              ]}
            >
              {m.sender === 'bot' && (
                <View style={styles.botBubbleHeader}>
                  <Text style={styles.botBadge}>PAW AI ASSISTANT</Text>
                </View>
              )}
              <Text
                style={[
                  styles.msgText,
                  m.sender === 'user' ? styles.userMsgText : styles.botMsgText
                ]}
              >
                {m.text}
              </Text>
            </View>
          ))}

          {isTyping && (
            <View style={[styles.bubble, styles.botBubble, { width: 80 }]}>
              <Text style={styles.typingDots}>typing...</Text>
            </View>
          )}

          {/* Quick Prompt Chips */}
          <View style={styles.chipsSection}>
            <Text style={styles.chipsTitle}>QUICK QUESTIONS</Text>
            <View style={styles.chipsWrap}>
              {PROMPT_CHIPS.map((chip, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.chip}
                  onPress={() => handleSend(chip)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.chipText}>{chip}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ask about pet diet, care, medicine..."
            placeholderTextColor={colors.textMuted}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => handleSend()}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
            onPress={() => handleSend()}
            disabled={!input.trim()}
          >
            <Ionicons name="send" size={16} color="#FFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  botAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  botName: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  onlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 1,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  onlineText: {
    fontSize: 10,
    color: '#059669',
    fontWeight: '600',
  },
  messagesScroll: {
    padding: spacing.lg,
    paddingBottom: 24,
  },
  bubble: {
    maxWidth: '82%',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  botBubble: {
    backgroundColor: colors.surface,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderTopLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: colors.primaryDark,
    alignSelf: 'flex-end',
    borderTopRightRadius: 4,
  },
  botBubbleHeader: {
    marginBottom: 4,
  },
  botBadge: {
    fontSize: 8,
    fontWeight: '800',
    color: '#0284C7',
    letterSpacing: 0.5,
  },
  msgText: {
    fontSize: 13,
    lineHeight: 19,
  },
  botMsgText: {
    color: colors.textPrimary,
  },
  userMsgText: {
    color: '#FFF',
    fontWeight: '600',
  },
  typingDots: {
    fontSize: 11,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  chipsSection: {
    marginTop: spacing.xl,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  chipsTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: borderRadius.full,
  },
  chipText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.lg,
    height: 44,
    fontSize: 13,
    color: colors.textPrimary,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: colors.border,
  },
});
