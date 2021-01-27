import React from 'react';
import classes from './App.module.css';
import Layout from "./Container/Layout";

import { getSunrise, getSunset } from 'sunrise-sunset-js';

class App extends React.Component {

    state = {
        country: '',
        date: '',
        lat: '',
        lon: '',
        sunrise:'',
        sunset: '',
        error: undefined,
        currLat:0,
        currLon:0,
        currCity:''
    }

    componentDidMount() {
        debugger
        if ("geolocation" in navigator) {
             navigator.geolocation.getCurrentPosition((position) => {
                this.setState({
                    currLat: position.coords.latitude,
                    currLon:position.coords.longitude,
                })
                 this.getNameOfCity(this.state.currLat,this.state.currLon)
            });

        }

    }


    handlerCountry = (event) => {
        this.setState({
            country: event.target.value
        })
        console.log(this.state)
    }
    changeDateHandler = (event) => {
        this.setState({
            date: event.target.value
        })
    }


    getNameOfCity = async (lat,lon) => {
        debugger
        if (lat == 0 && lon == 0) return
     const res = await fetch (`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=e736380e3e394c049d7dff11d7ed8023`)
        const data = await res.json();
           this.setState({
               currCity: data.results[0].components.city,
           })
        console.log("api")
    }

    gettingSunTime = async (e) => {
        var city = this.state.country ? this.state.country : this.state.currCity;
        var dateofDay = this.state.date
        e.preventDefault()
        if (city && dateofDay) {
            const api_url = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=9a96ae3721c1fbb6ca5cfe4a38f8235e&units=metric`)
            const data = await api_url.json()

            var sunsetTime = getSunset(data.coord.lat,data.coord.lon,new Date (dateofDay))
            var sunriseTime = getSunrise(data.coord.lat,data.coord.lon,new Date (dateofDay))
            var stringSunsetTime = sunsetTime.toString()
            var stringSunriseTime = sunriseTime.toString()

            this.setState({
                sunrise: stringSunriseTime,
                sunset: stringSunsetTime,
                error: ""
            });
        } else {
            this.setState({
                sunrise: undefined,
                sunset: undefined,
                error:"Enter the name of the city"
            })
        }

    }







    render() {
        return (

                <React.Fragment>
                    <div className={classes.Name}>
                        <h1><strong>Sunrise and sunset application</strong></h1>
                    </div>
                    <div className="form-row">
                        <div className={classes.city}>
                            <input type="text" className="form-control" placeholder={this.state.currCity} onChange={this.handlerCountry} value={this.state.country}/>
                        </div>
                        <div className={classes.city}>
                            <input type="date" className="form-control" placeholder="Date" onChange={this.changeDateHandler}/>
                        </div>
                    </div>
                    <div className={classes.button}>
                        <button type="button" className="btn btn-success" onClick={this.gettingSunTime}>Show</button>
                    </div>
                    <hr/>
                    {this.state.sunrise &&
                    <div className={classes.context}>
                        <div>
                             <p><i className="far fa-sun"></i>  Sunrise: {this.state.sunrise}</p>
                        </div>
                        <div>
                            <p><i className="far fa-moon"></i>  Sunset: {this.state.sunset} </p>

                        </div>
                    </div>
                    }

                </React.Fragment>


        );
    }
}

export default App;




