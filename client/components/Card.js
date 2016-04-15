import React from "react";
import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardHeader from 'material-ui/lib/card/card-header';
import CardMedia from 'material-ui/lib/card/card-media';
import CardTitle from 'material-ui/lib/card/card-title';
import RaisedButton from 'material-ui/lib/raised-button';
import CardText from 'material-ui/lib/card/card-text';
import FlatButton from 'material-ui/lib/flat-button'

export default class DishCard extends React.Component {

  addToFavorites() {
    var that = this;
    var fav = {
      userID: 2,
      postID: 1
    }
    let data = JSON.stringify(fav);

    fetch('http://localhost:4000/myfavs', {  
        method: 'post',  
         headers: {  
          'Accept': 'application/json',
          'Content-Type': 'application/json'
         },  
        body: data   
    })
    .then(function(resp){
      console.log('addfavs response: ', resp)
    })
  }

  getYelp() {
    
  }

  render() {

    const cardStyle = {
      padding: "30px",
      height: "650px"
    };

    const imageStyle = {
      width: "100%",
      maxHeight: "360px",
      width: "auto"
    };

    const cardMediaStyle = {
      height: "370px"
    };

    const cardWrapperStyle = {
      marginBottom: "30px",
      display: "block"
    };

    const buttonStyle = {
      backgroundColor: "#E9573F"
    };

    return (
      <div className="cardWrapper col-sm-6 col-lg-4" style={cardWrapperStyle}>
        <Card
          className=""
          style={cardStyle}>
          <CardHeader
            title={"User Number "+ this.props.data.user_id}
            subtitle={"Category Number "+ this.props.data.category}
            avatar="http://lorempixel.com/200/200/"
          />
          <CardMedia style={cardMediaStyle}>
              <img style={imageStyle} src={this.props.data.picture_path} />
          </CardMedia>
          <CardTitle
            title={this.props.data.dish_name}
            subtitle={this.props.data.rest_name}
          />
          <row>
            <strong style={{clear: "none", float: "right"}}>
              ${this.props.data.price}
            </strong>
            <span style={{float: "left"}}>
              {this.props.data.spicy ? " [🌶]" : ""}
              {this.props.data.gluten_free ? " [🚫🍞]" : ""}
              {this.props.data.veggie ? " [🌽]" : ""}
            </span>
          </row>
          <CardActions>
            <FlatButton label="Add to Favorites" onClick={this.addToFavorites} />
          </CardActions>
          <CardActions>
            <FlatButton label="Find out More" onClick={this.getYelp} />
          </CardActions>
        </Card>
      </div>
    );
  }
}
