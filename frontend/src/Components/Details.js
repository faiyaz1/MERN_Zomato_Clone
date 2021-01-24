import React from 'react';
import '../Styles/Details.css';
import queryString from 'query-string';
import axios from 'axios';
import Modal from 'react-modal';

import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        'z-index': '5 !important'
    }
};

class Details extends React.Component {
    constructor() {
        super();
        this.state = {
            restuarant: {},
            itemModalIsOpen: false,
            formModalIsOpen: false,
            galleryModalIsOpen: false,
            restaurantId: undefined,
            items: [],
            subTotal: 0,
            name: '',
            contactNumber: '',
            address: ''
        }
    }

    componentDidMount() {
        const queryParams = queryString.parse(this.props.location.search);
        const restuarantId = queryParams.restaurant;

        // API Call 

        axios({
            method: 'GET',
            url: `http://localhost:6503/api/getResById/${restuarantId}`,
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {
            this.setState({ restuarant: response.data.restaurant, restaurantId: restuarantId })
        }).catch(error => console.log(error))
    }

    handleOrder = () => {
        const { restaurantId } = this.state;

        axios({
            method: 'GET',
            url: `http://localhost:6503/api/getItemsbyrestaurant/${restaurantId}`,
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {
            this.setState({ items: response.data.itemsList, itemModalIsOpen: true })
        }).catch(error => console.log(error));
    }

    addItems = (index, operationType) => {
        let total = 0;
        const items = [...this.state.items];
        const item = items[index];

        if (operationType == 'add') {
            item.qty = item.qty + 1;
        }
        else {
            item.qty = item.qty - 1;
        }
        items[index] = item;
        items.map((item) => {
            total += item.qty * item.price;
        })
        this.setState({ items: items, subTotal: total });
    }

    handlePay = () => {
        this.setState({ itemModalIsOpen: false, formModalIsOpen: true })
    }

    handleModalClose = (state) => {
        this.setState({ [state]: false });
    }

    handleChange = (event, state) => {
        this.setState({ [state]: event.target.value });
    }

    handleSubmit = (event) => {
        const { name, contactNumber, address } = this.state;
        if (name && contactNumber && address) {
            const obj = {
                name: name,
                contactNumber: contactNumber,
                address: address
            };
            // Payment API Call
        }
        else {
            alert('All are mandatory feilds, plz fill them');
        }
        event.preventDefault();
    }

    handleGallery = () => {
        this.setState({ galleryModalIsOpen: true });
    }

    isDate(val) {
        // Cross realm comptatible
        return Object.prototype.toString.call(val) === '[object Date]'
    }

    isObj = (val) => {
        return typeof val === 'object'
    }

    stringifyValue = (val) => {
        if (this.isObj(val) && !this.isDate(val)) {
            return JSON.stringify(val)
        } else {
            return val
        }
    }

    buildForm = ({ action, params }) => {
        const form = document.createElement('form')
        form.setAttribute('method', 'post')
        form.setAttribute('action', action)

        Object.keys(params).forEach(key => {
            const input = document.createElement('input')
            input.setAttribute('type', 'hidden')
            input.setAttribute('name', key)
            input.setAttribute('value', this.stringifyValue(params[key]))
            form.appendChild(input)
        })

        return form
    }

    post = (details) => {
        const form = this.buildForm(details)
        document.body.appendChild(form)
        form.submit()
        form.remove()
    }

    getData = (data) => {

        return fetch(`http://localhost:6503/api/payment`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }).then(response => response.json()).catch(err => console.log(err))
    }

    makePayment = (e) => {
        const { subTotal } = this.state;
        this.getData({ amount: subTotal, email: 'abc@gmail.com' }).then(response => {
            var information = {
                action: "https://securegw-stage.paytm.in/order/process",
                params: response
            }
            this.post(information);
        })
        e.preventDefault();
    }

    render() {
        const { restuarant, itemModalIsOpen, items, subTotal, formModalIsOpen, name, address, contactNumber, galleryModalIsOpen } = this.state;
        return (
            <React.Fragment>
                <div>
                    <img src={`../${restuarant && restuarant.thumb && restuarant.thumb[0]}`} alt="No Image, Sorry for the Inconvinience" width="100%" height="400" />
                    <button className="button" onClick={this.handleGallery}>Click to see Image Gallery</button>
                </div>
                <div className="heading">{restuarant.name}</div>
                <button style={{ float: 'right' }} onClick={this.handleOrder} className="btn btn-danger">Place Online Order</button>
                <div className="tabs">
                    <div className="tab">
                        <input type="radio" id="tab-1" name="tab-group-1" checked />
                        <label for="tab-1">Overview</label>

                        <div className="content">
                            <div className="about">About this place</div>
                            <div className="head">Cuisine</div>
                            <div className="value">{restuarant.cuisine ? restuarant.cuisine.map((item) => item.name + ' ,') : null}</div>
                            <div className="head">Average Cost</div>
                            <div className="value">&#8377; {restuarant.min_price} for two people(approx)</div>
                        </div>
                    </div>

                    <div className="tab">
                        <input type="radio" id="tab-2" name="tab-group-1" />
                        <label for="tab-2">Contact</label>
                        <div className="content">
                            <div className="head">Phone Number</div>
                            <div className="value">{restuarant.contact_number}</div>
                            <div className="head">{restuarant.name}</div>
                            <div className="value">{`${restuarant.locality}, ${restuarant.city}`}</div>
                        </div>
                    </div>
                </div>
                <Modal
                    isOpen={itemModalIsOpen}
                    style={customStyles}
                >
                    <div >
                        <div className="glyphicon glyphicon-remove lose" style={{ float: 'right' }} onClick={() => this.handleModalClose('itemModalIsOpen')}></div>
                        <h3 className="restaurant-name">{restuarant.name}</h3>
                        <h3>SubTotal : {subTotal}</h3>
                        <button className="btn btn-danger" onClick={this.handlePay}> Pay Now</button>
                        {items.map((item, index) => {
                            return <div style={{ width: '44rem', marginTop: '10px', marginBottom: '10px', borderBottom: '2px solid #dbd8d8' }}>
                                <div className="card" style={{ width: '43rem', margin: 'auto' }}>
                                    <div className="row" style={{ paddingLeft: '10px', paddingBottom: '10px' }}>
                                        <div className="col-xs-9 col-sm-9 col-md-9 col-lg-9 " style={{ paddingLeft: '10px', paddingBottom: '10px' }}>
                                            <span className="card-body">
                                                <h5 className="item-name">{item.name}</h5>
                                                <h5 className="item-name">&#8377;{item.price}</h5>
                                                <p className="card-text">{item.description}</p>
                                            </span>
                                        </div>
                                        <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3"> <img className="card-img-center title-img" src="../Assets/breakfast.jpg" style={{ height: '75px', width: '75px', 'border-radius': '20px' }} />
                                            {item.qty == 0 ? <div><button className="add-button" onClick={() => this.addItems(index, 'add')}>Add</button></div> :
                                                <div className="add-number"><button onClick={() => this.addItems(index, 'subtract')}>-</button><span style={{ backgroundColor: 'white' }}>{item.qty}</span><button onClick={() => this.addItems(index, 'add')}>+</button></div>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        })}
                        <div className="card" style={{ width: '44rem', marginTop: '10px', marginBottom: '10px', margin: 'auto' }}>

                        </div>
                    </div>
                </Modal>
                <Modal
                    isOpen={formModalIsOpen}
                    style={customStyles}
                >
                    <div>
                        <div className="glyphicon glyphicon-remove lose" style={{ float: 'right' }} onClick={() => this.handleModalClose('formModalIsOpen')}></div>
                        <form onSubmit={this.makePayment}>
                            <table>
                                <tr>
                                    <td>Name</td>
                                    <td><input type="text" value={name} onChange={(event) => this.handleChange(event, 'name')} /></td>
                                </tr>
                                <tr>
                                    <td>Conatct Number</td>
                                    <td><input type="text" value={contactNumber} onChange={(event) => this.handleChange(event, 'contactNumber')} /></td>
                                </tr>
                                <tr>
                                    <td>Address</td>
                                    <td><input type="text" value={address} onChange={(event) => this.handleChange(event, 'address')} /></td>
                                </tr>
                            </table>
                            <input type="submit" className="btn btn-danger" value="Proceed" />
                        </form>
                    </div>

                </Modal>
                <Modal
                    isOpen={galleryModalIsOpen}
                    style={customStyles}
                >
                    <div className="glyphicon glyphicon-remove lose" style={{ float: 'right' }} onClick={() => this.handleModalClose('galleryModalIsOpen')}></div>
                    <Carousel
                        showIndicators={false}
                        showThumbs={false}
                    >
                        {restuarant ? restuarant.thumb && restuarant.thumb.map((item) => {
                            return <div>
                                <img src={`../${item}`} />
                            </div>
                        }) : null}
                    </Carousel>
                </Modal>
            </React.Fragment>
        )
    }
}


export default Details;