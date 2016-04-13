import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRoute, hashHistory } from "react-router";
import injectTapEventPlugin from 'react-tap-event-plugin';

import Navbar from "./components/Navbar"
import AddCard from "./components/AddCard"
import CardFeed from "./components/CardFeed"

import Login from "./components/Login"

import fetch from "node-fetch";
import $ from 'jquery';

injectTapEventPlugin();

class Layout extends React.Component {
  constructor() {
    super();
    this.state = {
      auth: false,
      veg: false,
      gf: false,
      noSpice: false,
      category: null,
      cardData: [],
      showAdd: false,
      showFavs: false,
      dishName: '',
      restaurantName: '',
      dishDescription: '',
      dishPrice: '',
      dishRating: '',
      vegClick: false,
      gfClick: false,
      spicyClick: false,
      photo: null,
      dishCat: 999
    };

    this.getCardData();
  }
  authToggle(){
    this.setState({auth: !this.state.auth});
    console.log(this.state.auth);
  }
  stateToggle(event) {
    this.setState({[event]: !this.state[event]});
  }

  categorySelect(category) {
    this.setState({category});
  }
  // photoInput(files) {
  //   this.setState({photo: files});
  // }
  dishNameInput(dishName) {
    this.setState({dishName: dishName});
  }
  restaurantNameInput(restaurantName) {
    this.setState({restaurantName: restaurantName});
  }
  // dishDescriptionInput(dishDescription) {
  //   this.setState({dishDescription: dishDescription});
  // }
  dishPriceInput(dishPrice) {
    this.setState({dishPrice: dishPrice});
  }
  dishRatingInput(dishRating) {
    this.setState({dishRating: dishRating});
  }
  vegInput() {
    this.setState({vegClick: !this.state.vegClick});
  }
  gfInput() {
    this.setState({gfClick: !this.state.gfClick});
  }
  spicyInput() {
    this.setState({spicyClick: !this.state.spicyClick});
  }
  photoAdd(url) {
    this.setState({photo: url})
  }
  catAdd(category) {
    this.setState({dishCat: category})
  }
  addCardSubmit() {
    var that = this;
    var newDish = {
      // TODO - figure out categories and users
      "user_id": 5,
      "category": this.state.dishCat,
      "timestamp": "01:30:00",
      "dish_name": this.state.dishName,
      "rest_name": this.state.restaurantName,
      "price": Number(this.state.dishPrice),
      "picture_path": this.state.photo,
      "veggie": this.state.vegClick,
      "gluten_free": this.state.gfClick,
      "spicy": this.state.spicyClick,
      "rating": this.state.dishRating
    }
    
    var file = {
      photo: that.state.photo[0]
    }

    // fetch('http://localhost:4000/upload', {
    //   method: 'POST',
    //   body: 'test'
    // })
    // .then(function() {
    //   console.log("I think the file saved?");
    // })
    // .catch(function(err) {
    //   console.log("Yo, I'm pretty sure something didn't work...:", err);
    // })

  ////// VERY HACKY FIX //////
    if (this.state.dishRating !== '') {

      $.ajax({
        type: "POST",
        url: "/feed",
        data: newDish,
        // cache: false,
        // processData: false,
        // contentType: false
      })
      .done(function() {
        console.log("New dish posted");
        that.state.cardData.unshift(newDish);
        that.setState({showAdd: false});
        that.setState({
          dishName: '',
          restaurantName: '',
          dishDescription: '',
          dishPrice: '',
          dishRating: '',
          vegClick: false,
          gfClick: false,
          spicyClick: false,
          photo: null,
          dishCat: null
        });
      })
      .fail(function() {
        console.log("Failed to post new dish");
      })
    }

  }

  getCardData(){
    // TODO - Replace this with a database call
    var that = this;

    fetch('http://localhost:4000/feed')
    .then(function(res) {
      return res.json();
    })
    .then(function(json) {
      console.log('got this json', json);
      that.setState({cardData: json})
    })
    .catch(function(err) {
      console.log('something went wrong getting data', err);
    });
        /*
    $.ajax({
      url: '/feed',
      dataType: 'json',
      cache: false,
      success: function(data) {
        console.log('got this data from /feed', data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.log('getCardData failed, status: ', status, 'error: ', err);
      }.bind(this)
    
    });
    */
  }

  render() {

    // console.log("client.js state:", this.state);
    return (
      <div>
        {/* Pass methods & state vars to Toolbar Component through props */}
        <Navbar
          auth={this.state.auth}
          authToggle={this.authToggle.bind(this)}
          veg={this.state.veg}
          gf={this.state.gf}
          noSpice={this.state.noSpice}
          showAdd={this.state.showAdd}
          showFavs={this.state.showFavs}
          category={this.state.category}
          categorySelect={this.categorySelect.bind(this)}
          stateToggle={this.stateToggle.bind(this)}
        />
        <br />
        {this.state.auth ? <Login

          /> : null
        }

        <br/>
        { this.state.showAdd ? <AddCard 
          dishNameInput={this.dishNameInput.bind(this)}
          restaurantNameInput={this.restaurantNameInput.bind(this)}
          // dishDescriptionInput={this.dishDescriptionInput.bind(this)}
          dishPriceInput={this.dishPriceInput.bind(this)}
          dishRatingInput={this.dishRatingInput.bind(this)}
          vegInput={this.vegInput.bind(this)}
          gfInput={this.gfInput.bind(this)}
          spicyInput={this.spicyInput.bind(this)}
          addCardSubmit={this.addCardSubmit.bind(this)}
          // photoInput={this.photoInput.bind(this)}
          photo={this.state.photo ? this.state.photo[0].preview : null}
          photoAdd={this.photoAdd.bind(this)}
          showAdd={this.state.showAdd}
          catAdd={this.catAdd.bind(this)}
          dishCat={this.state.dishCat}
          /> : null }
        <CardFeed
          boolVeg={this.state.veg}
          boolGF={this.state.gf}
          boolNoSpice={this.state.noSpice}
          cardData={this.state.cardData}
          category={this.state.category}
        />
      </div>
    );
  }
}

const app = document.getElementById('app');

ReactDOM.render(<Layout/>, app);
