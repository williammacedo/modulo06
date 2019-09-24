import Reactotron from 'reactotron-react-native';

const ip_casa = '192.168.15.7';
const ip_trabalho = '10.68.101.90';

if (__DEV__) {
  const tron = Reactotron.configure({ host: ip_casa })
    .useReactNative()
    .connect();

  console.tron = tron;

  tron.clear();
}
