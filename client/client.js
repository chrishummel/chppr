import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRoute, hashHistory } from "react-router";
import injectTapEventPlugin from 'react-tap-event-plugin';

import Navbar from "./components/Navbar"
import AddCard from "./components/AddCard"
import CardFeed from "./components/CardFeed"

import Login from "./components/Login"

import request from "superagent"
import cookie from 'react-cookie';

import fetch from "node-fetch";
import $ from 'jquery';

injectTapEventPlugin();

class Layout extends React.Component {
  constructor() {
    super();
    this.state = {
      yummy: cookie.load('yummy'),
      auth: false,
      veg: false,
      gf: false,
      noSpice: false,
      category: null,
      cardData: [],
      categoryData: [],
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
      viewPhoto: null,
      dishCat: 999
    };

    this.getCardData();
    this.getCategoryData();
  }

  getFBToken(){
    //console.log('calling something');
    request.get('/auth/facebook')
    .end((err, res) => {
      if (err) {
        console.log('client error', err);
      } else {
        console.log('client success', res);
      }
    });
  }
  authToggle(status){
    if(status == 'logout'){
      cookie.remove('yummy', { path: '/' });
      this.setState({showAdd: false});
      request('GET', '/logout').end(function(err,res){
        if (err) {
          console.log('client error', err);
        } else {
          console.log(res);
        }
      });
      


      console.log('deleted')
      this.setState({yummy:null});
    } else {
      this.setState({auth: !this.state.auth});
    }
  }
  stateToggle(event) {
    this.setState({[event]: !this.state[event]});
  }

  categorySelect(category) {
    this.setState({category});
  }
  photoInput(files) {
    this.setState({viewPhoto: files}); 

    const req = request.post('/upload');
    console.log("original files: ", files);
    const data = new FormData();
    var file = files[0];
    data.append('file', file);
    console.log("photoInput file: ", file);
    req.send(data);
    req.end((err, res) => {
      if (err) {
        console.log('client error', err);
      } else {
        let path = res.text.slice(0, 7);
        console.log('client success', res.text);
        this.setState({photo: 'pictures/' + res.text});

      }
    });
  }

  dishNameInput(dishName) {
    this.setState({dishName: dishName});
  }
  restaurantNameInput(restaurantName) {
    this.setState({restaurantName: restaurantName});
  }
  // dishDescriptionInput(dishDescription) {
  //   this.setState({dishDescription: dishDescription});
  // }

  restaurantCityInput(restaurantCity) {
    this.setState({restaurantCity: restaurantCity});
  }

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
  // photoAdd(url) {
  //   this.setState({photo: url})
  // }
  catAdd(category) {
    this.setState({dishCat: category})
  }
  addCardSubmit() {
    var that = this;
    var newDish = {

          "user_id": this.state.yummy.uid,
          "category": this.state.dishCat,
          "timestamp": "01:30:00",
          "dish_name": this.state.dishName,
          "rest_name": this.state.restaurantName,
          "rest_city": this.state.restaurantCity,
          "price": Number(this.state.dishPrice),
          "picture_path": this.state.photo,
          "veggie": this.state.vegClick,
          "gluten_free": this.state.gfClick,
          "spicy": this.state.spicyClick,
          "rating": this.state.dishRating
        }
    //copy this object and use a modified version for display
    let displayDish = Object.assign({}, newDish);
    displayDish['username'] = this.state.yummy.username;
    displayDish['photo'] = this.state.yummy.photo;

    console.log('our dish:',displayDish);

    let data = JSON.stringify(newDish);

    fetch('http://localhost:4000/feed', {  
        method: 'post',  
         headers: {  
           //"Content-type": "application/x-www-form-urlencoded; charset=UTF-8"  
          'Accept': 'application/json',
          'Content-Type': 'application/json'
         },  
        body: data //'foo=bar&lorem=ipsum'  
      })
    .then(function (data) {  
      console.log('Request succeeded with JSON response', data);  
      console.log("New dish posted");
        that.state.cardData.unshift(displayDish);
        that.setState({showAdd: false});
        that.setState({
          dishName: '',
          restaurantName: '',
          restaurantCity: '',
          dishDescription: '',
          dishPrice: '',
          dishRating: '',
          vegClick: false,
          gfClick: false,
          spicyClick: false,
          photo: null,
          dishCat: null
        })
    })  
    .catch(function (error) {  
      console.log('Request failed', error);  
    });

  }

  getCardData() {
    // TODO - Replace this with a database call
    var that = this;
    // console.log('got our current dir:',__dirname)
    fetch('http://localhost:4000/feed', {
      method: 'GET',
      headers: {  
           //"Content-type": "application/x-www-form-urlencoded; charset=UTF-8"  
          'Accept': 'application/json',
         }  
    })
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

  }
  getUserData(){
     // TODO - Replace this with a database call
     var that = this;
 
     fetch('http://localhost:4000/users')
     .then(function(res) {
       return res.json();
     })
     .then(function(json) {
       console.log('got this json', json);
       that.setState({userData: json})
     })
     .catch(function(err) {
       console.log('something went wrong getting users', err);
     });
   }
 
   getCategoryData(){
     // TODO - Replace this with a database call
     var that = this;
 
     fetch('http://localhost:4000/categories')
     .then(function(res) {
       return res.json();
     })
     .then(function(json) {
       console.log('got this json', json);
       that.setState({categoryData: json})
     })
     .catch(function(err) {
       console.log('something went wrong getting categories', err);
     });
   }

  render() {

    // console.log("client.js state:", this.state);
    return (
      <div>
        {/* Pass methods & state vars to Toolbar Component through props */}
        <Navbar
          auth={this.state.auth}
          yummy={this.state.yummy}
          authToggle={this.authToggle.bind(this)}
          getFBToken={this.getFBToken.bind(this)}
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
        
        { this.state.showAdd ? <AddCard 
          dishNameInput={this.dishNameInput.bind(this)}
          restaurantNameInput={this.restaurantNameInput.bind(this)}
          // dishDescriptionInput={this.dishDescriptionInput.bind(this)}
          restaurantCityInput={this.restaurantCityInput.bind(this)}
          dishPriceInput={this.dishPriceInput.bind(this)}
          dishRatingInput={this.dishRatingInput.bind(this)}
          vegInput={this.vegInput.bind(this)}
          gfInput={this.gfInput.bind(this)}
          spicyInput={this.spicyInput.bind(this)}
          addCardSubmit={this.addCardSubmit.bind(this)}
          photoInput={this.photoInput.bind(this)}
          photo={this.state.photo ? this.state.photo[0].preview : null}
          viewPhoto={this.state.viewPhoto ? this.state.viewPhoto[0].preview : null}
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
          userData={this.state.userData}
          categoryData={this.state.categoryData}
        />
      </div>
    );
  }
}

const app = document.getElementById('app');

ReactDOM.render(<Layout/>, app);


//photoAdd={this.photoAdd.bind(this)}