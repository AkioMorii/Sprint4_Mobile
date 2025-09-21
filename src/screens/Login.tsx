import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import bcrypt from 'bcryptjs';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedPassword = password.trim();

      if (!trimmedEmail || !trimmedPassword) {
        Alert.alert('Erro', 'Nenhum campo pode ficar vazio.');
        return;
      }

      const storedUser = await AsyncStorage.getItem('user');

      if (storedUser) {
        const user = JSON.parse(storedUser);

        if (user.email.toLowerCase() === trimmedEmail) {
          const passwordMatch = bcrypt.compareSync(trimmedPassword, user.password);

          if (passwordMatch) {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Home', params: { email: trimmedEmail } }],
            });
          } else {
            Alert.alert('Erro', 'Senha incorreta!');
          }
        } else {
          Alert.alert('Erro', 'Usuário não encontrado com este e-mail!');
        }
      } else {
        Alert.alert('Erro', 'Usuário não encontrado! Faça o cadastro.');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      Alert.alert('Erro', 'Erro ao fazer login. Tente novamente.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SafeBet</Text>
      <Text>Email:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <Text>Senha:</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <View style={styles.buttonContainer}>
        <Button title="Login" onPress={handleLogin} />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Criar Conta" onPress={() => navigation.navigate('Register')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { borderWidth: 1, marginBottom: 10, padding: 8, borderRadius: 5 },
  buttonContainer: {
    marginBottom: 7,
  },
  title: { 
    fontSize: 30, 
    textAlign: 'center',
    marginBottom: 30,
  },
});
