import React from 'react';
import '../Styles/QuickSearch.css';
import { withRouter } from 'react-router-dom';

class QuickSearchItem extends React.Component {
    handleClick = (Id) => {
        const locationId = sessionStorage.getItem('locationId');
        if (locationId) {
            this.props.history.push(`/filter/?mealtype=${Id}&area=${locationId}`);
        }
        else {
            this.props.history.push(`/filter/?mealtype=${Id}`);
        }
    }

    render() {
        const { id, name, content, image } = this.props;
        return (
            <div class="col-sm-12 col-md-12 col-lg-4" onClick={() => this.handleClick(id)}>
                <div class="tileContainer">
                    <div class="tileComponent1">
                        <img src={`../${image}`} height="150" width="140" />
                    </div>
                    <div class="tileComponent2">
                        <div class="componentHeading">
                            {name}
                        </div>
                        <div class="componentSubHeading">
                            {content}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(QuickSearchItem);