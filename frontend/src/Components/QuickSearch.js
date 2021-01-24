import React from 'react';
import '../Styles/QuickSearch.css';
import QuickSearchItem from './QuickSearchItem';

class QuickSearch extends React.Component {
    render() {
        const { quicksearches } = this.props;
        return (
            <div class="quicksearch">
                <p class="quicksearchHeading">
                    Quick Searches
            </p>
                <p class="quicksearchSubHeading">
                    Discover restaurants by type of meal
            </p>
                <div class="container-fluid">
                    <div class="row">
                        {quicksearches.map(item => {
                            return <QuickSearchItem id={item.meal_type} name={item.name} content={item.content} image={item.image} />
                        })
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default QuickSearch;