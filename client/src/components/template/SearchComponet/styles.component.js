import styled from 'styled-components'
export const SearchMain = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 2rem;
  @media (min-width: 768px) {
    max-width: 61.5rem;
    margin: 2rem;
    width: 100%;
  }
`

export const ListGroup = styled.ul`
  display: flex;
  align-self: center;
  align-items: center;
  flex-direction: column;
  margin-top: 6rem;
  position: absolute;
  max-width: inherit;
  width: inherit;
  max-height: 400px;
  overflow-x: hidden;
  border-radius: 0.7rem;
  box-shadow: -1px 0px 13px -1px rgba(0, 0, 0, 0.4);
  -webkit-box-shadow: -1px 0px 13px -1px rgba(0, 0, 0, 0.4);
  -moz-box-shadow: -1px 0px 13px -1px rgba(0, 0, 0, 0.4);

  .search-details {
    display: flex;
  }
  .item-con {
    display: flex;
    justify-content: space-between;
    border-bottom: none;
    border-top: none;
  }
  .search-dis {
    margin-left: 10px;
    display: flex;
    flex-direction: column;
  }
  .search-name {
    font-weight: 700;
    font-size: 13px;
  }

  .search-areaOfexp {
    font-family: 'American Typewriter', serif;
    font-weight: 400;
    font-size: 12px;
    opacity: 0.7 !important;
  }

  .search-img {
    width: 40px;
    height: 40px;
  }

  .online-size {
    position: absolute;
    top: 66%;
    left: 3.3rem;
    font-size: 10px;
  }
`

export const MobileListGroup = styled.ul`
  display: flex;
  align-self: center;
  align-items: center;
  flex-direction: column;
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: white;
  z-index: 888;

  overflow-x: hidden;
  .search-details {
    display: flex;
  }
  .item-con {
    display: flex;
    justify-content: space-between;
    border-bottom: none;
    border-top: none;
    min-height: 55px;
  }
  .search-dis {
    margin-left: 10px;
    display: flex;
    flex-direction: column;
  }
  .search-name {
    font-weight: 700;
    font-size: 13px;
  }

  .search-areaOfexp {
    font-family: 'American Typewriter', serif;
    font-weight: 400;
    font-size: 12px;
    opacity: 0.7 !important;
  }

  .search-img {
  }

  .online-size {
    position: absolute;
    top: 66%;
    left: 3.3rem;
    font-size: 10px;
  }
`
