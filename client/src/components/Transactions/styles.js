import styled from "styled-components";

export const LgContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto 0 auto;
  width: 100%;
  padding: 20px;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
`;

export const UserTransactionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #e6e6e6;
  border-radius: 0.5rem;
  background-color: #fafafa;
`;

export const UserTransaction = styled.div`
  display: flex;
  flex-direction: column;
`;

export const UserTransactionsLayout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2rem;

  .user-transactions-payouts {
    display: none;
  }

  .hidden-block {
    display: block;
  }

  .user-transactions-balance {
    margin: 0.5rem 0;
    flex-grow: 0.4;
    border: 2px solid #e6e6e6;
    border-radius: 1rem;
    background-color: #fff;
  }

  .total {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    margin: 0 1rem;
  }

  .total-header-text {
    color: #616160;
  }

  .total-flex {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 16px;
  }

  .total-flex-balance {
    display: flex;
    justify-content: space-between;
    font-size: 16px;
  }

  .total-amount {
    font-weight: bold;
    font-size: 22px;
  }

  .total-date {
    font-size: 14px;
    color: #8c8c8c;
  }

  .view-transaction {
    font-size: 16px;
    font-weight: 500;
    color: #498bd1;
    cursor: pointer;
    margin-top: 1rem;
  }

  .vertical-border {
    border-right: 2px dashed #e6e6e6;
  }

  .total-status {
    border: none;
    border-radius: 1.3rem;
    align-self: start;
    padding: 7px;
    font-size: 15px;
  }

  .pending {
    color: #fc7000;
    background-color: #fff8f2;
    font-weight: semibold;
  }

  .success {
    color: #2eff2e;
    background-color: #eaffea;
    font-weight: semibold;
  }

  @media screen and (min-width: 767px) {
    display: flex;
    flex-direction: row;

    .user-transactions-payouts {
      display: grid;
      grid-template-columns: 1fr 1fr;
      flex-grow: 0.5;
      margin: 0.5rem;
      padding: 0.5rem;
      box-sizing: border-box;
      border: 2px solid #e6e6e6;
      border-radius: 1rem;
      background-color: #fff;
    }

    .hidden-block {
      display: none;
    }

    .hidden-flex {
      display: none;
    }

    .user-transactions-balance {
      margin: 0.5rem;
    }

    .total {
      padding: 0.5rem;
      margin: 0 1rem;
    }

    .total-flex {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
  }

  @media screen and (min-width: 1023px) {
    .total-amount {
      font-weight: bold;
      font-size: 30px;
    }

    .total-pad {
      padding: 1rem 0;
    }

    .total-flex {
      font-size: 20px;
    }

    .total-flex-balance {
      font-size: 20px;
    }

    .total-date {
      font-size: 18px;
    }
  }
`;

export const UserTransactionsDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 2rem;
  padding: 2rem;
  background-color: #fff;

  .transaction-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .transaction-header {
    display: flex;
  }

  .transaction-header-text {
    font-size: 2rem;
    font-weight: 600;
    color: gray;
    margin: 2rem 0.5rem;
  }

  .transaction-filter {
    display: none;
  }

  .transaction-filter-text {
    padding-top: 1rem;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .transaction-filter-input {
    max-width: 100%;
    flex-grow: 1;
    border: none;
    outline: none;
    padding: 0 0.5rem;
    border-left: 2px solid #e6e6e6;
  }

  .transaction-filter-input-1 {
    display: flex;
    max-width: 100%;
    flex-grow: 1;
    border: 1px solid #e6e6e6;
    border-radius: 0.5rem;
    outline: none;
    padding: 0.5rem;
    margin: 1rem 0;
  }

  .flex {
    display: flex;
    align-items: center;
    padding: 0.5rem;
  }

  .transactions-list {
    border: 1px solid #e6e6e6;
    border-radius: 1rem;
    background-color: #fafafa;
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2), 0 2px 10px 0 rgba(0, 0, 0, 0.19);
    margin-bottom: 1rem;
  }

  .received-text {
    color: green;
  }

  .sent-text {
    color: red;
  }

  .status-text {
    align-self: end;
  }

  .transaction-search-icon {
    font-size: 18px;
  }

  .no-transaction-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .no-transaction-img {
    width: 50vw;
    height: 45vh;
    margin: -5rem;
  }

  .align-text {
    text-align: center;
  }

  @media screen and (min-width: 624px) {
    .no-transaction-img {
      width: 40vw;
      height: 45vh;
      margin: -5rem;
    }
  }

  @media screen and (min-width: 767px) {
    .transaction-filter {
      display: flex;
      border: 1px solid #e6e6e6;
      border-radius: 0.5rem;
      background-color: #fff;
      margin: 1.5rem 0.5rem;
      font-size: 18px;
    }

    .no-transaction-img {
      width: 30vw;
      height: 35vh;
      margin: 1rem;
    }

    // .transaction-search-icon {
    //   display: none;
    // }
  }
`;

export const ReUsedImageContainer = styled.div`
  height: 4rem;
  width: 4rem;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  background: #262626;
  flex-shrink: 0;
  margin-right: 1rem;

  .image {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
`;

export const ReusedBigText = styled.p`
  font-size: 1.6rem;
  margin: 0 !important;
  font-weight: 400;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const ReUsableSmallText = styled.p`
  font-size: 1.2rem;
  margin: 0 !important;
  font-weight: 300;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;
