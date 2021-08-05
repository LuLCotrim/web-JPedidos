import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input } from '@rocketseat/unform';
import * as Yup from 'yup';

import { signInRequest } from '../../store/modules/auth/actions';

import {Container, Content} from './styles'

const schema = Yup.object().shape({
  login: Yup.string()
    .required('O login é obrigatório'),
  password: Yup.string().required('A senha é obrigatória'),
});

export default function SignIn() {
  const dispatch = useDispatch();
  const loading = useSelector(state => state.auth.loading);

  function handleSubmit({ login, password }) {
    dispatch(signInRequest(login, password));
  }

  return (
    <Container>

      <Content>
        <Form schema={schema} onSubmit={handleSubmit}>
          <Input name="login" type="login" placeholder="Seu login" />
          <Input
            name="password"
            type="password"
            placeholder="Sua senha secreta"
          />

          <button type="submit">{loading ? 'Carregando...' : 'Acessar'}</button>
        </Form>
      </Content>
    </ Container>
  );
}
