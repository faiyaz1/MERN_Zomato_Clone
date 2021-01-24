import React from 'react';
import '../Styles/Wallpaper.css';
import homeImg from '../Assets/homepageimg.png';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

class Wallpaper extends React.Component {
    constructor() {
        super();
        this.state = {
            restaurants: [],
            text: '',
            suggestions: []
        }
    }

    handleLocationChange = (event) => {
        const locationId = event.target.value;
        sessionStorage.setItem('locationId', locationId);

        axios({
            method: 'GET',
            url: `http://localhost:6503/api/getRestaurantsbycity/${locationId}`,
            headers: { 'Content-Type': 'application/json' }
        }).then(res => this.setState({ restaurants: res.data.restaurantList }))
            .catch(err => console.log(err))
    }

    handleInputChange = (e) => {
        const value = e.target.value;
        const { restaurants } = this.state;
        let suggestions = [];

        if (value.length > 0) {
            suggestions = restaurants.filter(item => item.name.toLowerCase().includes(value.toLowerCase()));
        }
        this.setState(() => ({
            suggestions: suggestions,
            text: value
        }))
    }

    selectedText = (itemObj) => {
        this.setState({
            text: itemObj.name,
            suggestions: [],
        }, () => {
            this.props.history.push(`/details/?restaurant=${itemObj._id}`);
        })
    }

    renderSuggestions = () => {
        const { suggestions } = this.state;

        if (suggestions.length === 0) {
            return null;
        }
        return (
            <ul >
                {
                    suggestions.map((item, index) => (<li key={index} onClick={() => this.selectedText(item)}>{`${item.name}, ${item.city}`}</li>))
                }
            </ul>
        );
    }

    render() {
        const { locations, text } = this.props;
        return (
            <React.Fragment>
                <img src={homeImg} style={{ width: '100%', height: '450px' }} />
                <div>
                    <div className="logo">
                        <p>e!</p>
                    </div>
                    <div className="headings">
                        Find the best restaurants, cafes, bars
                </div>
                    <div className="locationSelector">
                        <select className="locationDropdown" onChange={this.handleLocationChange}>
                            <option value="0">Select</option>
                            {locations.map(item => {
                                return <option value={item.location_id}>{`${item.name}, ${item.city}`}</option>
                            })}
                        </select>
                        <div id="notebooks">
                            <input id="query" className="restaurantsinput" type="text" placeholder="Please Enter Restaurant Name" value={text} onChange={this.handleInputChange} />
                            {this.renderSuggestions()}
                        </div>
                        <span className="glyphicon glyphicon-search search"></span>
                    </div>
                </div>
            </React.Fragment >
        )
    }
}

export default withRouter(Wallpaper);