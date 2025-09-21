import React from 'react';
import { View, Text, Button, StyleSheet, Linking } from 'react-native';

export default function RiskAlertScreen({ navigation }: any) {
  const openGmail = () => {
    const email = 'tortadequeijo01@gmail.com'; // Destinatário
    const subject = 'SafeBet: Gostaria de conversar!'; // Assunto do e-mail
    const body = '';

    // Formatação da URL para abrir o Gmail
    const mailUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Abrir o Gmail (ou qualquer app de e-mail configurado)
    Linking.openURL(mailUrl).catch((err) => {
      console.error('Erro ao abrir o Gmail', err);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.warning}>🚨 Atenção!</Text>
      <Text style={styles.textBox}>
        Detectamos acesso repetitivo a aplicativos de apóstas em um curto período de tempo. Recomendamos que entre em
        contato com profissionais que irão prestar assistência. Para conversar é só enviar o email:
      </Text>
      <Button title="Buscar Ajuda" onPress={openGmail} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  warning: { fontSize: 24, color: 'red', marginBottom: 10 },
  textBox: { justifyContent: 'center', alignItems: 'center', padding: 10 },
});
