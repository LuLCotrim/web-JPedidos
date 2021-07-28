import React, {useEffect, useState} from 'react';
import api from '../../services/api';
import history from '../../services/history';
import { Form, Input, Select } from '@rocketseat/unform';
import { toast } from 'react-toastify';

import * as Yup from 'yup';

import { Container, FormDiv, TableDiv } from './styles';
import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';


const schema = Yup.object().shape({
  login: Yup.string().required('O login é obrigatório'),
  name: Yup.string().required('O nome é obrigatório'),
  email: Yup.string().email('O email deve ser valido').required('O email é obrigatório'),
  password: Yup.string().required('A senha é obrigatória').min(6, 'A senha deve conter pelo menos 6 caracteres'),
  type: Yup.string().required('O tipo de usuário é obrigatório'),
});

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function loadUsers() {
      const response = await api.get('users');

      const data = response.data;

      setUsers(data);
    }

    loadUsers();
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function handleSubmit(data) {
    console.log(data);
    if (!updating) {
      try{
        await api.post('users', data);
      }
      catch(e) {
        toast.error('Verifique se o usuário já existe');
      }
    }
    else {
      try{
        console.log('data update');
        console.log(data);
        await api.put(`users/${profile.id}`, {
          id: profile.id,
          name: data.name,
          email: data.email,
          login: data.login,
          type: data.type
        });
        toast.success('Usuário alterado com sucesso');
        setProfile({});
        setUpdating(!updating);
      }
      catch(e) {
        toast.error('Verifique se o usuário já existe');
      }
    }


    const response = await api.get('users');

    setUsers(response.data);

  }

  console.log(users);

  const [modal, setModal] = useState(false);
  const [userId, setUSerId] = useState();
  const [profile, setProfile] = useState();
  const [updating, setUpdating] = useState(false);

  const toggle = () => setModal(!modal);

  const toggleId = (id) => {
    setModal(!modal);
    setUSerId(id);
  }

  async function deleteUser() {
    console.log('userId');
    console.log(userId);
    try {
      await api.delete(`users/${userId}`);
      toast.success('Usuário deletado com sucesso');
    }
    catch(e) {
      toast.error('Erro ao deletar o usuário');
    }

    const response = await api.get('users');

    setUsers(response.data);
    setModal(!modal);
  }

  function toggleUpdate(user) {
    setProfile(user);
    setUpdating(!updating);
  }

  return (
    <Container>
      <FormDiv>
      <h1>Usuário</h1>
      <Form schema={schema} initialData={profile} onSubmit={handleSubmit}>
        <Input name="name" type="text" placeholder="Seu nome" />
        <Input name="email" type="email" placeholder="Seu email" />
        <Input name="login" type="text" placeholder="Seu login" />
        <Input name="password" type="password" placeholder="Seu password" />
        <Select name="type" placeholder="Tipo de Usuário" options={[{id: "administrador", title: "administrador"},{id: "gerente", title: "gerente"},{id: "funcionario", title: "funcionario"}]} />

        <button type="submit">Salvar</button>
      </Form>
      </FormDiv>
      <TableDiv>
        <Table>
          <tr>
            <th>Name</th>
            <th>Login</th>
            <th>Email</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
          {
            users.map(user => (
              <tr>
                <td>{user.name}</td>
                <td>{user.login}</td>
                <td>{user.email}</td>
                <td>{user.type}</td>
                <td>
                  <button onClick={() => toggleUpdate(user)}>{updating && user.id == profile.id ? 'Cancelar' : 'Editar'}</button>
                  <button onClick={() => toggleId(user.id)}>Deletar</button>
                </td>
              </tr>
            ))
          }
        </Table>
      </TableDiv>

      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Deletar Usuário</ModalHeader>
        <ModalBody>
          Deseja Realmente deletar o usuário ?
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => deleteUser()}>Deletar</Button>{' '}
          <Button color="secondary" onClick={toggle}>Cancelar</Button>
        </ModalFooter>
      </Modal>

    </Container>
  );
}

export default Users;