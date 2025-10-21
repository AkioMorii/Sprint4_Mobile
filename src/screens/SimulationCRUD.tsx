import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { brl, parseBRNumber, nonNegative } from '../simulation/Number';
import { useSimulations } from '../simulation/SimulationContext';
import type { SimulationStackParamList } from '../screens/SimulationList';

type Props = NativeStackScreenProps<SimulationStackParamList, 'SimulationForm'>;

export default function SimulationForm({ route, navigation }: Props) {
  const id = route.params?.id;
  const { getById, add, update } = useSimulations();

  const editing = Boolean(id);
  const existing = useMemo(() => (id ? getById(id) : undefined), [id, getById]);

  const [startedText, setStartedText] = useState(existing ? String(existing.started) : '');
  const [wonText, setWonText] = useState(existing ? String(existing.won) : '');
  const [lostText, setLostText] = useState(existing ? String(existing.lost) : '');

  const started = parseBRNumber(startedText);
  const won = parseBRNumber(wonText);
  const lost = parseBRNumber(lostText);

  const valid =
    nonNegative(started) &&
    nonNegative(won) &&
    nonNegative(lost);

  const finalAmount = valid ? started + won - lost : NaN;

  function onSave() {
    if (!valid) {
      Alert.alert('Verifique os campos', 'Use valores numéricos e não negativos.');
      return;
    }
    const payload = {
      id: editing && existing ? existing.id : String(Date.now()),
      started,
      won,
      lost,
      final: finalAmount,
      createdAt: editing && existing ? existing.createdAt : Date.now(),
    };
    editing ? update(payload) : add(payload);
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{editing ? 'Editar simulação' : 'Nova simulação'}</Text>

      <Field label="Dinheiro inicial" value={startedText} onChangeText={setStartedText} invalid={!nonNegative(started) && startedText !== ''} />
      <Field label="Quanto ganhou"   value={wonText}     onChangeText={setWonText}     invalid={!nonNegative(won) && wonText !== ''} />
      <Field label="Quanto perdeu"   value={lostText}    onChangeText={setLostText}    invalid={!nonNegative(lost) && lostText !== ''} />

      <View style={styles.resultBox}>
        <Text style={styles.resultLabel}>Resultado final</Text>
        <Text
          style={[
            styles.resultValue,
            { color: Number.isNaN(finalAmount) ? '#555' : finalAmount >= started ? 'green' : 'red' },
          ]}
        >
          {Number.isNaN(finalAmount) ? '—' : brl.format(finalAmount)}
        </Text>
      </View>

      <View style={{ height: 16 }} />

      <Pressable style={[styles.btn, !valid && styles.btnDisabled]} onPress={onSave} disabled={!valid}>
        <Text style={styles.btnText}>{editing ? 'Salvar alterações' : 'Criar simulação'}</Text>
      </Pressable>

      <View style={{ height: 8 }} />
      <Pressable style={[styles.btn, styles.btnSecondary]} onPress={() => navigation.goBack()}>
        <Text style={[styles.btnText, styles.btnTextSecondary]}>Cancelar</Text>
      </Pressable>
    </View>
  );
}

function Field({
  label,
  value,
  onChangeText,
  invalid,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  invalid?: boolean;
}) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        inputMode="decimal"
        keyboardType="numeric"
        placeholder="0,00"
        style={styles.input}
      />
      {invalid ? <Text style={styles.error}>Informe um valor numérico ≥ 0</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 12 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16 },
  error: { color: 'crimson', marginTop: 6 },
  btn: { backgroundColor: '#111', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  btnDisabled: { opacity: 0.5 },
  btnSecondary: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#111' },
  btnText: { color: 'white', fontWeight: '700' },
  btnTextSecondary: { color: '#111' },
  resultBox: {
    marginTop: 8, padding: 14, borderRadius: 10, backgroundColor: '#F6F7F9',
    borderWidth: 1, borderColor: '#E7E9EE', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  resultLabel: { fontSize: 14, fontWeight: '600' },
  resultValue: { fontSize: 18, fontWeight: '800' },
});
