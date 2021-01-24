import React from 'react';
import axios from 'axios';

import Wallpaper from './Wallpaper';
import QuickSearch from './QuickSearch';

class Home extends React.Component {
    constructor() {
        super();
        this.state = {
            locations: [],
            mealtypes: []
        }
    }

    componentDidMount() {
        sessionStorage.clear();
        axios({
            method: 'GET',
            url: 'http://localhost:6503/api/cityList',
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {
            this.setState({ locations: response.data.city })
        }).catch(error => console.log(error))

        axios({
            method: 'GET',
            url: 'http://localhost:6503/api/mealtype',
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {
            this.setState({ mealtypes: response.data.mealtype })
        }).catch(error => console.log(error))
    }

    render() {
        const { locations, mealtypes } = this.state;
        return (
            <div>
                <Wallpaper locations={locations} />
                <QuickSearch quicksearches={mealtypes} />
            </div>
        )
    }
}

export default Home;