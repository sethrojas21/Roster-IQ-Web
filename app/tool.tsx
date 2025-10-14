import GradientTitle from '@/components/ui/gradient-title';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export default function Tool() {
    const [messages, setMessages] = useState<ChatMessage[]>([{
        id: 'welcome',
        role: 'assistant',
        content: 'Describe your team system philosophy, desired pace, style (e.g., 5-out, motion, heavy PnR), and the player archetype you want to recruit. I will translate that into target metric profiles and candidate filters.'
    }]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;
        const userMsg: ChatMessage = { id: Date.now() + '-u', role: 'user', content: input.trim() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);
        try {
            // Placeholder: simulate API call to OpenAI / backend proxy
            await new Promise(r => setTimeout(r, 900));
            const assistantMsg: ChatMessage = {
                id: Date.now() + '-a',
                role: 'assistant',
                content: 'Mock analysis: Focus on high rim pressure (FGA/100 > 18), strong AST/FGA synergy (>.55) and positive defensive rebounding (DREB% > 18). Consider wings with versatile usage (22-24% USG) and above benchmark TS%.'
            };
            setMessages(prev => [...prev, assistantMsg]);
        } catch (e) {
            const errMsg: ChatMessage = { id: Date.now() + '-e', role: 'assistant', content: 'Error contacting model. Please retry.' };
            setMessages(prev => [...prev, errMsg]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
            <View style={styles.inner}>
                <GradientTitle title="RosterIQ Recruit Assistant" position={undefined} seasonYear={undefined} teamName={undefined} />
                <Text style={styles.subtitle}>Chat interface to transform system descriptions into metric targets & player filters.</Text>

                <View style={styles.chatBox}>
                    {messages.map(m => (
                        <View key={m.id} style={[styles.messageRow, m.role === 'user' ? styles.userRow : styles.assistantRow]}>
                            <View style={[styles.messageBubble, m.role === 'user' ? styles.userBubble : styles.assistantBubble]}>
                                <Text style={styles.metaLabel}>{m.role === 'user' ? 'You' : 'IQ Assistant'}</Text>
                                <Text style={styles.messageText}>{m.content}</Text>
                            </View>
                        </View>
                    ))}
                    {loading && (
                        <View style={[styles.messageRow, styles.assistantRow]}>
                            <View style={[styles.messageBubble, styles.assistantBubble]}>
                                <Text style={styles.metaLabel}>IQ Assistant</Text>
                                <Text style={styles.messageText}>Thinking<span style={{ opacity: 0.5 }}>...</span></Text>
                            </View>
                        </View>
                    )}
                </View>

                <View style={styles.inputBar}>
                    <Ionicons name="chatbox-ellipses-outline" size={18} color="rgba(255,255,255,0.65)" />
                    <TextInput
                        style={styles.textArea}
                        placeholder="Describe system & player needs (e.g. fast pace, secondary playmaking wing with elite rim pressure)."
                        placeholderTextColor="rgba(255,255,255,0.45)"
                        multiline
                        value={input}
                        onChangeText={setInput}
                    />
                    <TouchableOpacity style={[styles.sendBtn, loading && styles.sendBtnDisabled]} onPress={sendMessage} disabled={loading}>
                        <Text style={styles.sendBtnText}>{loading ? '...' : 'Send'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    inner: {
        padding: 20,
        maxWidth: 860,
        width: '100%',
        alignSelf: 'center',
    },
    subtitle: {
        color: 'rgba(163,163,163,1)',
        fontSize: 14,
        marginTop: -4,
        marginBottom: 18,
        textAlign: 'center',
    },
    chatBox: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: 16,
        gap: 12,
        minHeight: 260,
    },
    messageRow: {
        flexDirection: 'row',
        width: '100%',
    },
    userRow: {
        justifyContent: 'flex-end',
    },
    assistantRow: {
        justifyContent: 'flex-start',
    },
    messageBubble: {
        maxWidth: '85%',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 14,
        borderWidth: 1,
    },
    userBubble: {
        backgroundColor: 'rgba(138,92,246,0.15)',
        borderColor: 'rgba(138,92,246,0.4)',
    },
    assistantBubble: {
        backgroundColor: 'rgba(255,255,255,0.07)',
        borderColor: 'rgba(255,255,255,0.15)',
    },
    metaLabel: {
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: 1,
        color: 'rgba(163,163,163,1)',
        marginBottom: 4,
    },
    messageText: {
        fontSize: 14,
        color: 'white',
        lineHeight: 20,
    },
    inputBar: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        marginTop: 18,
        backgroundColor: 'rgba(23,23,23,0.9)',
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: 'rgba(64,64,64,0.5)',
    },
    textArea: {
        flex: 1,
        color: 'white',
        fontSize: 14,
        minHeight: 80,
        maxHeight: 160,
    },
    sendBtn: {
        alignSelf: 'flex-end',
        backgroundColor: '#8A5CF6',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 10,
        shadowColor: '#8A5CF6',
        shadowOpacity: 0.35,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
    },
    sendBtnDisabled: {
        opacity: 0.5,
    },
    sendBtnText: {
        color: 'white',
        fontSize: 13,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    hintText: {
        marginTop: 14,
        fontSize: 11,
        color: 'rgba(163,163,163,1)',
        textAlign: 'center',
    },
});