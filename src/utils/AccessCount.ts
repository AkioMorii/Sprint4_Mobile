import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Busca o número de acessos do usuário atual
 * @param email Email do usuário logado
 * @returns Número de acessos
 */
export const getAccessCount = async (email: string): Promise<number> => {
  try {
    const count = await AsyncStorage.getItem(`accessCount_${email}`);
    return count ? parseInt(count, 10) : 0;
  } catch (error) {
    console.error('Erro ao buscar o contador:', error);
    return 0;
  }
};

/**
 * Incrementa o contador de acessos do usuário atual
 * @param email Email do usuário logado
 */
export const incrementAccessCount = async (email: string) => {
  try {
    const currentCount = await getAccessCount(email);
    const newCount = currentCount + 1;
    await AsyncStorage.setItem(`accessCount_${email}`, newCount.toString());
  } catch (error) {
    console.error('Erro ao incrementar o contador:', error);
  }
};

/**
 * Reseta o contador de um usuário específico (opcional, para testes)
 * @param email Email do usuário
 */
export const resetAccessCount = async (email: string) => {
  try {
    await AsyncStorage.removeItem(`accessCount_${email}`);
  } catch (error) {
    console.error('Erro ao resetar o contador:', error);
  }
};
