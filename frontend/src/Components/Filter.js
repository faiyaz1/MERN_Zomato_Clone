import React from 'react';
import '../Styles/Filter.css';
import queryString from 'query-string';
import axios from 'axios';

class Filter extends React.Component {
    constructor() {
        super();
        this.state = {
            restaurants: [],
            locations: [],
            location_id: undefined,
            mealtype_id: undefined,
            cuisine_id: [],
            hcost: undefined,
            lcost: undefined,
            sort: 1,
            page: 1,
            pages: []
        }
    }

    componentWillUnmount() {
        sessionStorage.clear();
    }

    componentDidMount() {
        const queryParams = queryString.parse(this.props.location.search);
        const mealtype_id = queryParams.mealtype;
        const cuisine_id = queryParams.cuisine;
        const location_id = queryParams.area;
        const hcost = queryParams.costlessthan;
        const lcost = queryParams.costmorethan;
        const sort = queryParams.sort;
        const page = queryParams.page;


        // Filter API Call 

        const filterObj = {
            mealtype_id: mealtype_id,
            cuisine_id: cuisine_id,
            location_id: location_id,
            hcost: hcost,
            lcost: lcost,
            sort: sort,
            page: page
        }

        axios({
            method: 'POST',
            url: 'http://localhost:6503/api/restaurantfilter',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        }).then(response => {
            this.setState({ restaurants: response.data.restaurant, pages: response.data.pageCount, location_id: location_id, mealtype_id: mealtype_id })
        }).catch(error => console.log(error))

        axios({
            method: 'GET',
            url: 'http://localhost:6503/api/cityList',
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {
            this.setState({ locations: response.data.city })
        }).catch(error => console.log(error))

    }

    handleClick = (Id) => {
        this.props.history.push(`/details/?restaurant=${Id}`);
    }

    handleSortChange = (sort) => {
        const { mealtype_id, location_id, cuisine_id, hcost, lcost, page } = this.state;

        const filterObj = {
            mealtype_id: mealtype_id,
            cuisine_id: cuisine_id,
            location_id: location_id,
            hcost: hcost,
            lcost: lcost,
            sort: sort,
            page: page
        }


        axios({
            method: 'POST',
            url: 'http://localhost:6503/api/restaurantfilter',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        }).then(response => {
            this.setState({ restaurants: response.data.restaurant, pages: response.data.pageCount, sort: sort })
        }).catch(error => console.log(error))

        this.props.history.push(`/filter/?mealtype=${mealtype_id}&cuisine=${cuisine_id}&area=${location_id}&costlessthan=${hcost}&costmorethan=${lcost}&sort=${sort}&page=${page}`)
    }

    handleCostChange = (lcost, hcost) => {
        const { mealtype_id, location_id, cuisine_id, page, sort } = this.state;

        const filterObj = {
            mealtype_id: mealtype_id,
            cuisine_id: cuisine_id,
            location_id: location_id,
            hcost: hcost,
            lcost: lcost,
            sort: sort,
            page: page
        }

        this.props.history.push(`/filter/?mealtype=${mealtype_id}&cuisine=${cuisine_id}&area=${location_id}&costlessthan=${hcost}&costmorethan=${lcost}&sort=${sort}&page=${page}`)

        axios({
            method: 'POST',
            url: 'http://localhost:6503/api/restaurantfilter',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        }).then(response => {
            this.setState({ restaurants: response.data.restaurant, pages: response.data.pageCount, lcost: lcost, hcost: hcost })
        }).catch(error => console.log(error))
    }

    handlePageChange = (page) => {
        const { mealtype_id, location_id, cuisine_id, sort, lcost, hcost } = this.state;

        const filterObj = {
            mealtype_id: mealtype_id,
            cuisine_id: cuisine_id,
            location_id: location_id,
            hcost: hcost,
            lcost: lcost,
            sort: sort,
            page: page
        }

        this.props.history.push(`/filter/?mealtype=${mealtype_id}&cuisine=${cuisine_id}&area=${location_id}&costlessthan=${hcost}&costmorethan=${lcost}&sort=${sort}&page=${page}`)

        axios({
            method: 'POST',
            url: 'http://localhost:6503/api/restaurantfilter',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        }).then(response => {
            this.setState({ restaurants: response.data.restaurant, pages: response.data.pageCount, lcost: lcost, hcost: hcost })
        }).catch(error => console.log(error))
    }

    handleCuisineChange = (cuisineId) => {

        const { mealtype_id, location_id, cuisine_id, sort, lcost, hcost, page } = this.state;

        if (cuisine_id.indexOf(cuisineId) == -1) {
            cuisine_id.push(cuisineId);
        }
        else {
            var index = cuisine_id.indexOf(cuisineId);
            cuisine_id.splice(index, 1);
        }

        const filterObj = {
            mealtype_id: mealtype_id,
            cuisine_id: cuisine_id,
            location_id: location_id,
            hcost: hcost,
            lcost: lcost,
            sort: sort,
            page: page
        }

        this.props.history.push(`/filter/?mealtype=${mealtype_id}&cuisine=${cuisine_id}&area=${location_id}&costlessthan=${hcost}&costmorethan=${lcost}&sort=${sort}&page=${page}`)

        axios({
            method: 'POST',
            url: 'http://localhost:6503/api/restaurantfilter',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        }).then(response => {
            this.setState({ restaurants: response.data.restaurant, pages: response.data.pageCount, lcost: lcost, hcost: hcost })
        }).catch(error => console.log(error))
    }

    render() {
        const { restaurants, locations, pages } = this.state;
        return (
            <div>
                <div id="myId" className="heading-filterComp">Breakfast Places in Mumbai</div>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-4 col-md-4 col-lg-4 filter-options">
                            <span className="glyphicon glyphicon-th-list toggle-span" data-toggle="collapse"
                                data-target="#demo"></span>
                            <div id="demo" className="collapse show">
                                <div className="filter-heading">Filters</div>
                                <div className="Select-Location">Select Location</div>
                                <select className="Rectangle-2236">
                                    <option>Select</option>
                                    {locations.map((item) => {
                                        return <option value={item.location_id}>{`${item.name}, ${item.city}`}</option>
                                    })}
                                </select>
                                <div className="Cuisine">Cuisine</div>
                                <div>
                                    <input type="checkbox" onChange={() => this.handleCuisineChange(1)} />
                                    <span className="checkbox-items">North Indian</span>
                                </div>
                                <div>
                                    <input type="checkbox" onChange={() => this.handleCuisineChange(2)} />
                                    <span className="checkbox-items">South Indian</span>
                                </div>
                                <div>
                                    <input type="checkbox" onChange={() => this.handleCuisineChange(3)} />
                                    <span className="checkbox-items">Chineese</span>
                                </div>
                                <div>
                                    <input type="checkbox" onChange={() => this.handleCuisineChange(4)} />
                                    <span className="checkbox-items">Fast Food</span>
                                </div>
                                <div>
                                    <input type="checkbox" onChange={() => this.handleCuisineChange(5)} />
                                    <span className="checkbox-items">Street Food</span>
                                </div>
                                <div className="Cuisine">Cost For Two</div>
                                <div>
                                    <input type="radio" name="cost" onChange={() => this.handleCostChange(1, 500)} />
                                    < span className="checkbox-items">Less than &#8377; 500</span>
                                </div>
                                <div>
                                    <input type="radio" name="cost" onChange={() => this.handleCostChange(500, 1000)} />
                                    <span className="checkbox-items">&#8377; 500 to &#8377; 1000</span>
                                </div>
                                <div>
                                    <input type="radio" name="cost" onChange={() => this.handleCostChange(1000, 1500)} />
                                    <span className="checkbox-items">&#8377; 1000 to &#8377; 1500</span>
                                </div>
                                <div>
                                    <input type="radio" name="cost" onChange={() => this.handleCostChange(1500, 2000)} />
                                    <span className="checkbox-items">&#8377; 1500 to &#8377; 2000</span>
                                </div>
                                <div>
                                    <input type="radio" name="cost" onChange={() => this.handleCostChange(2000, 10000)} />
                                    <span className="checkbox-items">&#8377; 2000 +</span>
                                </div>
                                <div>
                                    <input type="radio" name="cost" onChange={() => this.handleCostChange(1, 10000)} />
                                    <span className="checkbox-items">All</span>
                                </div>
                                <div className="Cuisine">Sort</div>
                                <div>
                                    <input type="radio" name="sort" onChange={() => this.handleSortChange(1)} />
                                    <span className="checkbox-items">Price low to high</span>
                                </div>
                                <div>
                                    <input type="radio" name="sort" onChange={() => this.handleSortChange(-1)} />
                                    <span className="checkbox-items">Price high to low</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-8 col-md-8 col-lg-8">
                            {restaurants.length == 0 ? <div className="no-item">No Items Found... </div> : restaurants.map((item) => {
                                return <div className="Item" onClick={() => this.handleClick(item._id)}>
                                    <div className="row pl-1">
                                        <div className="col-sm-4 col-md-4 col-lg-4">
                                            <img className="img" src={`../${item.image}`} />
                                        </div>
                                        <div className="col-sm-8 col-md-8 col-lg-8">
                                            <div className="rest-name">{item.name}</div>
                                            <div className="res-location">FORT</div>
                                            <div className="rest-address">Shop 1, Plot D, Samruddhi Complex, Chincholi …</div>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row padding-left">
                                        <div className="col-sm-12 col-md-12 col-lg-12">
                                            <div className="rest-address">CUISINES : Bakery</div>
                                            <div className="rest-address">COST FOR TWO : &#8377; {item.min_price} </div>
                                        </div>
                                    </div>
                                </div>
                            })}
                            {restaurants.length == 0 ? null :
                                <div className="pagination">
                                    <a >&laquo;</a>
                                    {pages.map((item) => {
                                        return <a onClick={() => this.handlePageChange(item)}>{item}</a>
                                    })}
                                    <a>&raquo;</a>
                                </div>}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Filter;