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

function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function loadProducts() {
      const response = await api.get('products');

      const data = response.data;

      setProducts(data);
    }

    loadProducts();
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function handleSubmit(data) {
    console.log(data);
    if (!updating) {
      try{
        await api.post('products', data);
      }
      catch(e) {
        toast.error('Verifique se o produto já existe');
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


    const response = await api.get('products');

    setProducts(response.data);

  }

  console.log(products);

  const [modal, setModal] = useState(false);
  const [productId, setProductId] = useState();
  const [profile, setProfile] = useState();
  const [updating, setUpdating] = useState(false);

  const toggle = () => setModal(!modal);

  const toggleId = (id) => {
    setModal(!modal);
    setProductId(id);
  }

  async function deleteProduct() {
    console.log('productId');
    console.log(productId);
    try {
      await api.delete(`products/${productId}`);
      toast.success('Produto deletado com sucesso');
    }
    catch(e) {
      toast.error('Erro ao deletar o produto');
    }

    const response = await api.get('products');

    setProducts(response.data);
    setModal(!modal);
  }

  function toggleUpdate(product) {
    setProfile(product);
    setUpdating(!updating);
  }

  return (
    <Container>
      <FormDiv>
      <h1>Produtos</h1>
      <Form schema={schema} initialData={profile} onSubmit={handleSubmit}>
        <Input name="name" type="text" placeholder="Nome do Produto" />
        <Input name="value" type="text" placeholder="Valor do produto" />
        <button type="submit">Salvar</button>
      </Form>
      </FormDiv>
      <TableDiv>
        <Table>
          <tr>
            <th>Name</th>
            <th>Value</th>
            <th>Actions</th>
          </tr>
          {
            products.map(product => (
              <tr>
                <td>{product.name}</td>
                <td>R${product.value}</td>
                <td>
                  <button onClick={() => toggleUpdate(product)}>{updating && product.id == profile.id ? 'Cancelar' : 'Editar'}</button>
                  <button onClick={() => toggleId(product.id)}>Deletar</button>
                </td>
              </tr>
            ))
          }
        </Table>
      </TableDiv>

      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Deletar Produto</ModalHeader>
        <ModalBody>
          Deseja Realmente deletar o produto ?
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => deleteProduct()}>Deletar</Button>{' '}
          <Button color="secondary" onClick={toggle}>Cancelar</Button>
        </ModalFooter>
      </Modal>

    </Container>
  );
}

export default Products;