import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SimulationList, { SimulationStackParamList } from '../screens/SimulationList';
import SimulationForm from '../screens/SimulationCRUD';

const Stack = createNativeStackNavigator<SimulationStackParamList>();

export default function SimulationStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SimulationList"
        component={SimulationList}
        options={{ title: 'Simulações' }}
      />
      <Stack.Screen
        name="SimulationForm"
        component={SimulationForm}
        options={{ title: 'Simulação' }}
      />
    </Stack.Navigator>
  );
}
