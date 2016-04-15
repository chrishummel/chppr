import React from "react";
import DishCard from "./Card"

export default class CardFeed extends React.Component {
  matchesUserFilters(c) {
    if (this.props.category !== null && this.props.category !== c.category) return false;
    if (this.props.boolNoSpice && c.spicy) return false;
    if (this.props.boolGF && c.gluten_free === false) return false;
    if (this.props.boolVeg && c.veggie === false) return false;
    return true;
  }

  render() {
    return (
      <div class="bodyWrap">
        {this.props.cardData.map((card) => this.matchesUserFilters(card) ?

          <DishCard
            data={card}
            categoryData={this.props.categoryData}
            addToFavorites={this.props.addToFavorites}
            getYelp={this.props.getYelp}
            yelpBasics={this.props.yelpBasics}
            yelpAddress={this.props.yelpAddress}
           /> :
          null)}
      </div>
    );
  }
}
