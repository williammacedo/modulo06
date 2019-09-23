import Reactotron from 'reactotron-react-native';

if (__DEV__) {
  const tron = Reactotron.configure({ host: '10.68.101.90' })
    .useReactNative()
    .connect();

  console.tron = tron;

  tron.clear();
}
