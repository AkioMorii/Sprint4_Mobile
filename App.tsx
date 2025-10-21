// App.tsx (trechos alterados/adicionados)
import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import LoginScreen from './src/screens/Login';
import RegisterScreen from './src/screens/Register';
import HomeScreen from './src/screens/Home';
import RiskAlertScreen from './src/screens/RiskAlert';
import { SimProvider } from './src/simulation/SimulationContext';
import SimulationStackNavigator from './src/simulation/Stack';

const RootStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function HomeStackNavigator({ route }: any) {
  const initialParams = route?.params;
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        initialParams={initialParams}
        options={({ navigation }) => ({
          title: 'SafeBet - Monitoramento',
          headerBackVisible: false,
          gestureEnabled: false,
          headerRight: () => (
            <Text
              style={{ marginRight: 15, color: 'red', fontWeight: 'bold', fontSize: 16 }}
              onPress={() => {
                navigation.getParent()?.getParent()?.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                });
              }}
            >
              Sair
            </Text>
          ),
        })}
      />
      <HomeStack.Screen
        name="RiskAlert"
        component={RiskAlertScreen}
        options={{ title: 'Alerta de Risco' }}
      />
    </HomeStack.Navigator>
  );
}

function AppDrawer({ route }: any) {
  const initialParams = route?.params;
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false }}>
      <Drawer.Screen
        name="HomeStack"
        component={HomeStackNavigator}
        initialParams={initialParams}
        options={{ title: 'Home' }}
      />
      <Drawer.Screen
        name="Simulations"
        component={SimulationStackNavigator}
        options={{ title: 'Simulações' }}
      />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <SimProvider>
      <NavigationContainer>
        <RootStack.Navigator initialRouteName="Login">
          <RootStack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
          <RootStack.Screen name="Register" component={RegisterScreen} options={{ title: 'Cadastro' }} />
          <RootStack.Screen name="Home" component={AppDrawer} options={{ headerShown: false }} />
        </RootStack.Navigator>
      </NavigationContainer>
    </SimProvider>
  );
}
