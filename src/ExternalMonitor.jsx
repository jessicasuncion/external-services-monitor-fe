import React, { Component } from "react";
import styled from 'styled-components';
import axios from "axios";

class ExternalMonitor extends Component {
  constructor() {
    super();
    this.state = {  
      data: null,
      showCurrent: false,
      showHistorical: false,
      isLoading: false
    };

    this.getCurrentData = this.getCurrentData.bind(this);
  }

  componentWillMount() {
    axios.get(`http://localhost:8080/`, {})
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error)
      });
  }
  
  handleChange(e) {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  getCurrentData() {
    this.setState({
      showCurrent: false,
      showHistorical: false,
      isLoading: true
    });

    axios.get(`http://localhost:8080/services/current`, {})
    .then(response => {
      console.log(response);

      this.setState({
        showCurrent: true,
        showHistorical: false,
        isLoading: false,
        data: response.data.data
      });
    })
    .catch(error => {
      console.log(error)
    });
  }

  getHistoricalData() {
    this.setState({
      showCurrent: false,
      showHistorical: false,
      isLoading: true
    });

    axios.get(`http://localhost:8080/services`, {})
    .then(response => {
      console.log(response);

      this.setState({
        showCurrent: false,
        showHistorical: true,
        isLoading: false,
        data: response.data.data
      });
    })
    .catch(error => {
      console.log(error)
    });
  }

  render() {
    const { data, isLoading, showCurrent, showHistorical } = this.state;

    return (
        <ExternalMonitorContainer>
            <header>
              EXTERNAL SERVICES MONITOR
            </header>
            <ButtonContainer>
              <button onClick={() => this.getCurrentData()}>
                CURRENT
              </button>
              <button onClick={() => this.getHistoricalData()}>
                HISTORICAL
              </button>
            </ButtonContainer> 
            { isLoading && <div>LOADING...</div>}
            { showCurrent && 
              <CurrentData>
                { data.map((box, index) => { 
                  return (
                    <CurrentDataBox key={index}>
                      <Name>{box.data.name}</Name>
                      <SuccessMarker isSuccessful={box.data.success}>{box.data.statusCode}</SuccessMarker>
                      <Statistic isSuccessful={box.data.success}>{box.data.elapsedTime} ms</Statistic>
                      <Date isSuccessful={box.data.success}>{box.data.timestamp} (UTC)</Date>       
                    </CurrentDataBox>
                  );
                })}
              </CurrentData> 
            }
            { showHistorical && 
              <HistoricalData>
                { data.map((row, index) => { 
                  return (
                    <DataRow key={index} isSuccessful={row.data.success}>
                      <div>Name: {row.data.name}</div>
                      <div>Status Code: {row.data.statusCode}</div>
                      <div>Elapsed Time: {row.data.elapsedTime}</div>
                      <div>Timestamp (UTC): {row.data.timestamp}</div>
                    </DataRow>
                  );
                })}
              </HistoricalData> 
            }
        </ExternalMonitorContainer>
    );
  }
}

const ExternalMonitorContainer = styled.div`
    width: 100%;
    height: 100%;

    header {
      background-color: rgba(112,128,144);
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding-left: 30px;
      color: white;
    }
`;

const ButtonContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    button {
      background-color: white;
      border-radius: 10px;
      color: rgb(112,128,144);
      height: 40px;
      width: 100px;
      padding: 10px;
      margin: 30px 10px;
      border: 1px solid rgb(112,128,144);

      &:hover {
        color: white;
        background-color: rgb(112,128,144);
        cursor: pointer;
      }
    }
`;

const HistoricalData = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const DataRow = styled.div`
  width: 80%; 
  height: 80px;
  border: 1px solid ${({ isSuccessful }) => isSuccessful ? 'green' : 'red' };
  border-radius: 10px;
  color: rgb(112,128,144);
  margin: 10px;
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

const CurrentData = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CurrentDataBox = styled.div`
  min-width: 400px;
  height: 300px;
  border: 1px solid rgb(112,128,144);
  border-radius: 10px;
  margin: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const SuccessMarker = styled.div`
  width: 100px;
  height: 100px;
  background-color: ${({ isSuccessful }) => isSuccessful ? 'green' : 'red' };
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin: 10px;
  padding: 10px;
  font-size: 35px;
`;

const Statistic = styled.div`
  width: 100px;
  height: 100px;
  border: 1px solid ${({ isSuccessful }) => isSuccessful ? 'green' : 'red' };
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ isSuccessful }) => isSuccessful ? 'green' : 'red' };
  margin: 10px;
  padding: 10px;
  font-size: 30px;
`;

const Date = styled.div`
  position: absolute;
  bottom: 5px;
  font-size: 12px;
  color: rgb(112,128,144);
`;

const Name = styled.div`
  position: absolute;
  top: 20px;
  font-size: 25px;
  color: rgb(112,128,144);
`;

export default ExternalMonitor;
