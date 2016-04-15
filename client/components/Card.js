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

  constructor() {
    super()
    this.state = {
      favorited: false
    }
  }

  handleFavClick() {
    if (!this.state.favorited) {
      this.setState({favorited: true})
      this.props.addToFavorites(this.props.data.postID);
    }
  }
  getCategoryName(obj){
    if (obj && obj.type !== 'undefined') return obj.type;
    return 'Some Category';
  }
  

  learnMore() {
    let id = this.props.data.yelp_id;
    this.props.getYelp(id);
  }

  render() {
    console.log('our userdata:',this.props.userData);


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
            title={"User: "+ this.props.data.username}
            subtitle={"Category: "+ this.getCategoryName(this.props.categoryData[this.props.data.category - 1])}
            avatar={this.props.data.photo ? this.props.data.photo : "http://lorempixel.com/200/200/"}
          />
          <CardMedia style={cardMediaStyle}>
              <img style={imageStyle} src={this.props.data.picture_path} />
          </CardMedia>
          <CardTitle
            title={this.props.data.dish_name}
            subtitle={this.props.data.rest_name}
          />
          <FlatButton 
            label="learn more"
            onClick={this.learnMore}
          />
          <div>
            <strong style={{clear: "none", float: "right"}}>
              ${this.props.data.price}
            </strong>
            <span style={{float: "left"}}>
              {this.props.data.spicy ? " [🌶]" : ""}
              {this.props.data.gluten_free ? " [🚫🍞]" : ""}
              {this.props.data.veggie ? " [🌽]" : ""}
            </span>
          </div>
          <div>
            <CardActions>
              <FlatButton 
                label={this.state.favorited ? "💙💙💙" : "Add to Favorites"} 
                onClick={this.handleFavClick.bind(this)} 
              />
            </CardActions>
          </div>
        </Card>
      </div>
    );
  }
}
