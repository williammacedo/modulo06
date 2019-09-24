import Reactotron from 'reactotron-react-native';
import AsyncStorage from '@react-native-community/async-storage';

const ipCasa = 'localhost';
// const ipTrabalho = '10.68.101.90';

if (__DEV__) {
  const tron = Reactotron.configure({ host: ipCasa })
    .useReactNative()
    .setAsyncStorageHandler(AsyncStorage)
    .connect();

  console.tron = tron;
}
