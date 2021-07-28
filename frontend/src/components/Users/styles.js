import styled from 'styled-components';
import { darken } from 'polished';

export const Container = styled.div`
  display: flex;

  div {
    margin: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

export const FormDiv = styled.div`
  flex-direction: column;

  form {
    display: flex;
    flex-direction: column;

    input {
      font-weight: bold;
      width: 300px;
      background: rgba(0, 0, 0, 0.1);
      border: 0;
      border-radius: 4px;
      height: 44px;
      padding: 0 15px;
      color: rgba(50, 50, 50, 1);;
      margin: 0 0 10px;

      &::placeholder {
        color: rgba(50, 50, 50, 0.7);
      }
    }

    select {
      font-weight: bold;
      width: 300px;
      background: rgba(0, 0, 0, 0.1);
      border: 0;
      border-radius: 4px;
      height: 44px;
      padding: 0 15px;
      color: rgba(50, 50, 50, 1);
      margin: 0 0 10px;
    }

    span {
      color: #fb6f91;
      align-self: flex-start;
      margin: 0 0 10px;
      font-weight: bold;
    }

    button {
      margin: 5px 0 0;
      height: 44px;
      background: #3b9eff;
      font-weight: bold;
      color: #fff;
      border: 0;
      border-radius: 4px;
      font-size: 16px;
      transition: background 0.2s;

      &:hover {
        background: ${darken(0.03, '#3b9eff')};
      }
    }

    a {
      color: #fff;
      margin-top: 15px;
      font-size: 16px;
      opacity: 0.8;

      &:hover {
        opacity: 1;
      }
    }
  }
`;

export const TableDiv = styled.div`
  table {
    tr {
      td,th {
        padding: 10px 25px;

        button:first-of-type {
          background-color: #2da9e3;
          padding: 10px 20px;
          border-radius: 4px;
          border: none;
          color: #fff;
          font-weight: bold;
          margin: 0px 20px 0px 0px;
        }
        button:last-of-type {
          background-color: #eb3734;
          padding: 10px 20px;
          border-radius: 4px;
          border: none;
          color: #fff;
          font-weight: bold;
          margin: 0px 20px 0px 0px;
        }
      }
    }
  }
`;