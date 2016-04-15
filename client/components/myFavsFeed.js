import React from "react";
import FavsCard from "./FavsCard"

export default class myFavsFeed extends React.Component {
  matchesUserFilters(c) {
    if (this.props.category !== null && this.props.category !== c.category) return false;
    if (this.props.boolNoSpice && c.spicy) return false;
    if (this.props.boolGF && c.gluten_free === false) return false;
    if (this.props.boolVeg && c.veggie === false) return false;
    return true;
  }

  render() {
    return (
      <div>
        {this.props.myFavs.map((card) => this.matchesUserFilters(card) ?

          <FavsCard
             data={card}
             categoryData={this.props.categoryData}
             addToFavorites={this.props.addToFavorites}
           /> :
          null)}
      </div>
    );
  }
}