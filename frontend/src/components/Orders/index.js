import React, {useEffect, useState} from 'react';
import api from '../../services/api';
import { Form, Input, Select } from '@rocketseat/unform';
import { toast } from 'react-toastify';

import * as Yup from 'yup';

import { Container, FormDiv, TableDiv } from './styles';
import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';


const schema = Yup.object().shape({
  name: Yup.string().required('O nome é obrigatório'),
  value: Yup.number().typeError('Digite um numero válido').required('O valor é obrigatório'),
});

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function loadOrders() {
      const response = await api.get('orders');

      const data = response.data;

      setOrders(data);
    }

    loadOrders();
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function handleSubmit(data) {
    console.log(data);
    if (!updating) {
      try{
        await api.post('orders', data);
      }
      catch(e) {
        toast.error('Verifique se o pedido já existe');
      }
    }
    else {
      try{
        console.log('data update');
        console.log(data);
        await api.put(`products/${profile.id}`, {
          name: data.name,
          value: data.value,
        });
        toast.success('Produto alterado com sucesso');
        setProfile({});
        setUpdating(!updating);
      }
      catch(e) {
        toast.error('Verifique se o produto já existe');
      }
    }


    const response = await api.get('orders');

    setOrders(response.data);

  }

  console.log(orders);

  const [modal, setModal] = useState(false);
  const [orderId, setOrderId] = useState();
  const [profile, setProfile] = useState();
  const [updating, setUpdating] = useState(false);

  const toggle = () => setModal(!modal);

  const toggleId = (id) => {
    setModal(!modal);
    setOrderId(id);
  }

  async function updateOrder() {
    console.log('productId');
    console.log(orderId);
    try {
      await api.put(`orders/${orderId}`, {
        status: 'fechado'
      });
      toast.success('Pedido encerrado com sucesso');
    }
    catch(e) {
      toast.error('Erro ao encerrar o pedido');
    }

    const response = await api.get('orders');

    setOrders(response.data);
    setModal(!modal);
  }

  function toggleUpdate(product) {
    setProfile(product);
    setUpdating(!updating);
  }

  return (
    <Container>
      <FormDiv>
      <h1>Pedidos</h1>
      <Form schema={schema} initialData={profile} onSubmit={handleSubmit}>
        <Input name="client_id" type="text" placeholder="Cliente" />
        <Input name="product_id" type="text" placeholder="Produtos" />
        <button type="submit">Salvar</button>
      </Form>
      </FormDiv>
      <TableDiv>
        <Table>
          <tr>
            <th>Order</th>
            <th>Product</th>
            <th>Value</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Status</th>
            <th>Close</th>
          </tr>
          {
            orders.map(order => (
              <tr>
                <td>{order.order_id}</td>
                <td>{order.product.name}</td>
                <td>R${order.product.value}</td>
                <td>{order.quantity}</td>
                <td>R${order.order.total}</td>
                <td>{order.order.status}</td>
                <td>
                  <button onClick={() => toggleId(order.order.id)}>Fechar Pedido</button>
                </td>
              </tr>
            ))
          }
        </Table>
      </TableDiv>

      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Encerrar Entrega</ModalHeader>
        <ModalBody>
          Deseja Realmente fechar a entrega ?
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => updateOrder()}>Encerrar</Button>{' '}
          <Button color="secondary" onClick={toggle}>Cancelar</Button>
        </ModalFooter>
      </Modal>

    </Container>
  );
}

export default Orders;