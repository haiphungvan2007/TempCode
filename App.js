import React, { Component } from "react";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      metaData: {
        url : "",
        image : "",
        title : "",
        description : ""
      }
    };

    this.onTextChanged = this.onTextChanged.bind(this);
    this.getUrl = this.getUrl.bind(this);
  }  

  render() {
    return (      
      <label>
        Abc: <input  type= "text" onChange={this.onTextChanged}/>
      </label>
    );
  }

  onTextChanged(event) {
    var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    var tempUrl = event.target.value;
    if (tempUrl.match(expression)) {
      this.setState((preState, props) => {
        return { 
          metaData: {
            url : tempUrl,
            image : "",
            title : "",
            description : ""
          }
        }
      });
      this.getUrl(tempUrl);
    }
  }

  getUrl(url) {
    const currentObject = this;
    fetch(URL, {
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin':'*'
      }
    })
    .then(function(response) {
      return response.text()
    }).then(function(responseData) {
      console.log(responseData);
      const {metaData} = currentObject.state;
      if (url === metaData.url) {                
        var htmlDom = document.createElement("html");
        htmlDom.innerHTML = responseData;
        
        var headDomList = htmlDom.getElementsByTagName("title");
        console.log(headDomList[0].innerText);
                
        currentObject.setState((preState, props) => {
          return { 
            metaData: metaData
          }
        });
      }
    });
  }
}

export default App;
