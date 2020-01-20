import React from 'react';
import './App.css';
// import { render } from '@testing-library/react';
import 'bootstrap/dist/css/bootstrap.css';

const Form = (props) => {
  return ( 
    <form onSubmit={props.submit}> 
      <input 
      type="text" 
      value={props.value}
      onChange = {props.change}
      placeholder="wpisz miasto"
       />
    </form>
   )
}

const Result = (props) => {
  const {date, err,city, temp, sunrise, sunset, pressure, wind} = props.weather
  let content = null;
  if(!err && city) {
    const sunriseTime = new Date(sunrise * 1000).toLocaleTimeString();
    const sunsetTime = new Date(sunset * 1000).toLocaleTimeString();
    content = (
      <div>
        <h3>Wyniki wyszukiwania dla: {(city).toUpperCase()} </h3>
        <h4>Dane dla dnia i godziny: {date}</h4>
        <h4>Aktualna temperatura: {temp} &#176;C </h4>
    <h4> Wschód słońca dzisiaj o: {sunriseTime}</h4>
    <h4> Zachód słońca dzisiaj o: {sunsetTime}</h4>
    <h4> Aktualna siła wiatru: {wind} m/s </h4>
    <h4> Aktalne ciśnienie: {pressure} hPa</h4>
      </div>
    )
  }
  
  return ( 
  <div className="result">
    {err ?`Nie mamy w bazie ${city}` : content}
  </div>
   );
}
 
 
class App extends React.Component {

  state = {
    value: '',
    date: '',
    city:'',
    sunrise:'',
    sunset:'',
    temp:'',
    pressure:'',
    wind:'',
    err: false,
  }
  handleInputChange = (e) => {
    this.setState ({
      value: e.target.value
    })
  }

componentDidUpdate(prevProps, prevState) {

  if(this.state.value === 0) return
  if(prevState.value !== this.state.value) {
   const keyApi = 'f9d8395e72be127f18dc09231cdac68a';
   const API = `http://api.openweathermap.org/data/2.5/weather?q=${this.state.value}&APPID=${keyApi}&units=metric`;
   
    fetch(API)
    .then(response => {
      if(response.ok) {
        return response
      }
      throw Error('Nie udało się')
    })
    .then(response => response.json())
    .then(data => {
      const time = new Date().toLocaleString()
      this.setState({
        err: false,
        date: time,
        sunrise: data.sys.sunrise,
        sunset:data.sys.sunset,
        temp: data.main.temp,
        pressure:data.main.pressure,
        wind:data.wind.speed,
        city:this.state.value,
      })
    })
    .catch(err=> {
      console.log(err)
      this.setState({
        err: true,
        city: this.state.value,
      })
    })
  }
}
    
  render() {
    return (
      <div className="App container-md"> 
        <Form value={this.state.value} 
        change ={this.handleInputChange}/>
        <Result weather={this.state}/>
      </div>
    )
  }
} 


export default App
