import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Keyboard, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Snackbar from 'react-native-snackbar';

import api from '../../services/api';

import {
  Container,
  Form,
  Input,
  SubmitButon,
  List,
  User,
  Avatar,
  Name,
  Bio,
  ProfileButton,
  ProfileButtonText,
} from './styles';

const INITIAL_STATE = {
  newUser: '',
  users: [],
  loading: false,
};

export default class Main extends Component {
  constructor(props) {
    super(props);

    this.state = INITIAL_STATE;
  }

  componentDidMount = async () => {
    const users = await AsyncStorage.getItem('users');

    if (users) {
      this.setState({ users: JSON.parse(users) });
    }
  };

  componentDidUpdate = (_, prevState) => {
    const { users } = this.state;
    if (prevState.users !== users) {
      AsyncStorage.setItem('users', JSON.stringify(users));
    }
  };

  handleAddUser = async () => {
    let response;
    const { users, newUser } = this.state;

    if (users.some(user => user.login === newUser)) {
      this.clearFormAndShowMessage(
        { newUser: '' },
        `O usuário ${newUser} já foi adicionado.`
      );
      return;
    }

    this.setState({ loading: true });
    try {
      response = await api.get(`/users/${newUser}`);
    } catch (error) {
      this.clearFormAndShowMessage(
        {
          newUser: '',
          loading: false,
        },
        `O usuário ${newUser} não existe no github.`
      );
      return;
    }

    const data = {
      name: response.data.name,
      login: response.data.login,
      bio: response.data.bio,
      avatar: response.data.avatar_url,
    };

    this.clearFormAndShowMessage(
      {
        users: [...users, data],
        newUser: '',
        loading: false,
      },
      `O usuário ${newUser} foi adicionado com sucesso.`
    );
  };

  handleNavigate = user => {
    const { navigation } = this.props;

    navigation.navigate('User', { user });
  };

  clearFormAndShowMessage = (state, message) => {
    this.clearForm(state);
    Snackbar.show({
      title: message,
      duration: Snackbar.LENGTH_SHORT,
      color: 'white',
    });
  };

  clearForm = state => {
    this.setState(state);
    Keyboard.dismiss();
  };

  render = () => {
    const { users, newUser, loading } = this.state;

    return (
      <Container>
        <Form>
          <Input
            placeholder="Adicionar Usuário"
            autoCorrect={false}
            autoCapitalize="none"
            value={newUser}
            returnKeyType="send"
            onSubmitEditing={this.handleAddUser}
            onChangeText={text => this.setState({ newUser: text })}
          />
          <SubmitButon loading={loading} onPress={this.handleAddUser}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Icon name="add" size={20} color="#fff" />
            )}
          </SubmitButon>
        </Form>

        <List
          data={users}
          keyExtractor={user => user.login}
          renderItem={({ item }) => (
            <User>
              <Avatar source={{ uri: item.avatar }} />
              <Name>{item.name}</Name>
              <Bio>{item.bio}</Bio>
              <ProfileButton onPress={() => this.handleNavigate(item)}>
                <ProfileButtonText>Ver perfil</ProfileButtonText>
              </ProfileButton>
            </User>
          )}
        />
      </Container>
    );
  };
}

Main.navigationOptions = {
  title: 'Usuarios',
};

Main.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};
