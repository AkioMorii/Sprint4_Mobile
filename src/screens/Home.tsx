import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation, route }: any) {
  const { email } = route.params;
  const [accessCount, setAccessCount] = useState(0);

  useEffect(() => {
    checkResetPeriod();
  }, []);

  const checkResetPeriod = async () => {
    try {
      const storedStartDate = await AsyncStorage.getItem(`StartDate_${email}`);
      const storedCount = await AsyncStorage.getItem(`AccessCount_${email}`);
      const today = new Date();

      if (storedStartDate) {
        const startDate = new Date(storedStartDate);
        const diffInDays = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

        if (diffInDays >= 7) {
          // Zera o contador e redefine a data de início após 7 dias
          await AsyncStorage.setItem(`AccessCount_${email}`, '0');
          await AsyncStorage.setItem(`StartDate_${email}`, today.toISOString());
          setAccessCount(0);
        } else if (storedCount) {
          setAccessCount(parseInt(storedCount, 10));
        }
      } else {
        // Primeira vez, salva a data inicial
        await AsyncStorage.setItem(`StartDate_${email}`, today.toISOString());
        setAccessCount(storedCount ? parseInt(storedCount, 10) : 0);
      }
    } catch (error) {
      console.error('Erro ao verificar/resetar contador:', error);
    }
  };

  const simulateAppAccess = async () => {
    try {
      const newCount = accessCount + 1;
      setAccessCount(newCount);
      await AsyncStorage.setItem(`AccessCount_${email}`, newCount.toString());

      if (newCount >= 3) {
        navigation.navigate('RiskAlert');
      }
    } catch (error) {
      console.error('Erro ao salvar contador:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Número de acessos a aplicativos de apostas nos últimos 7 dias: {accessCount}
      </Text>
      <Button title="Simular Acesso a aplicativo de aposta" onPress={simulateAppAccess} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  text: { fontSize: 16, marginBottom: 10 },
});
