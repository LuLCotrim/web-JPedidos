import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { Button } from 'reactstrap';
import { Container } from './styles';

import { signOut } from '../../store/modules/auth/actions';

import Users from '../../components/Users';
import Products from '../../components/Products';
import Orders from '../../components/Orders';

function Dashboard() {
  const dispatch = useDispatch();
  const profile = useSelector(state => state.user.profile);

  function handleSignOut() {
    dispatch(signOut());
  }

  console.log(profile);

  return (
    <Container>
      <nav>
      <h1>{profile.name}</h1>
      <Button onClick={handleSignOut}>Logout</Button>
      </nav>
      <div>
        {
          profile.type === "administrador" ?
          (
              <Users />
          )
          :
          profile.type === "gerente" ?
          (
            <Products />
          )
          :
          (
            <Orders />
          )
        }
      </div>
    </Container>
  );
}

export default Dashboard;