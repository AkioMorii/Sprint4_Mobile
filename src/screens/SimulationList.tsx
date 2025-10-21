// Tela de Adição e Edição de simulação de uma apósta. Acessada logo após o login.

import React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { brl } from '../simulation/Number';
import { useSimulations } from '../simulation/SimulationContext';
import { useFocusEffect } from '@react-navigation/native';

export type SimulationStackParamList = {
  SimulationList: undefined;
  SimulationForm: { id?: string } | undefined;
};

type Props = NativeStackScreenProps<SimulationStackParamList, 'SimulationList'>;

export default function SimulationList({ navigation }: Props) {
  const { list } = useSimulations();
  const hasRedirectedRef = React.useRef(false);

  useFocusEffect(
    React.useCallback(() => {
      if (!hasRedirectedRef.current && list.length > 3) {
        hasRedirectedRef.current = true;
        navigation.getParent()?.navigate('HomeStack', { screen: 'RiskAlert' });
      }
      return () => {};
    }, [list.length, navigation])
  );

  return (
    <View style={styles.container}>
      <Pressable style={styles.btn} onPress={() => navigation.navigate('SimulationForm')}>
        <Text style={styles.btnText}>Nova simulação</Text>
      </Pressable>

      <FlatList
        data={list}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate('SimulationForm', { id: item.id })}
            style={styles.card}
          >
            <Text style={styles.cardTitle}>
              Início {brl.format(item.started)} → Fim {brl.format(item.final)}
            </Text>
            <Text style={styles.cardSub}>
              +{brl.format(item.won)} • -{brl.format(item.lost)}
            </Text>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={{ marginTop: 16, textAlign: 'center', opacity: 0.7 }}>
            Nenhuma simulação ainda. Crie a primeira!
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  btn: { backgroundColor: '#111', padding: 12, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700' },
  card: { padding: 16, borderWidth: 1, borderColor: '#eee', borderRadius: 12, backgroundColor: '#fff' },
  cardTitle: { fontSize: 16, fontWeight: '700' },
  cardSub: { marginTop: 4, opacity: 0.7 },
});
