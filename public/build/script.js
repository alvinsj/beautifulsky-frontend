/** @jsx React.DOM */
$(function(){

	var Pic = React.createClass({displayName: 'Pic',
	  render: function() {
	    return (
	      React.DOM.div({className: "pic"}, 
	      	React.DOM.blockquote({className: "picText"}, 
	        	this.props.text, 
	        	React.DOM.div({className: "picAuthor"}, 
	          		React.DOM.small(null, this.props.author)
	        	)
	        ), 
	        
	        this.props.children
	      )
	    );
	  }
	});

	var PicList = React.createClass({displayName: 'PicList',
	  render: function() {
	    var picNodes = this.props.data.
	    filter(function(pic){ return pic.image_source.indexOf("instagram") > -1 }).
	    map(function (pic) {
	      return (
	        Pic({author: pic.user, text: pic.tweet}, 
	          React.DOM.div(null, React.DOM.img({src: pic.image_source+"media?size=l", className: "image"}))
	        )
	      );
	    });
	    return (
	      React.DOM.div({className: "picList"}, 
	        picNodes
	      )
	    );
	  }
	});

	var PicForm = React.createClass({displayName: 'PicForm',
	  render: function() {
	    return (
	      React.DOM.div({className: "picForm"}
	       
	      )
	    );
	  }
	});


	var PicBox = React.createClass({displayName: 'PicBox',
	  getInitialState: function() {
	    return {data: []};
	  },
	  loadPicsFromServer: function() {
	    $.ajax({
	      url: this.props.url,
	      dataType: 'json',
	      success: function(data) {
	        this.setState({data: data});
	      }.bind(this),
	      error: function(xhr, status, err) {
	        console.error(this.props.url, status, err.toString());
	      }.bind(this)
	    });
	  },
	  componentDidMount: function() {
	    this.loadPicsFromServer();
	    //setInterval(this.loadPicsFromServer, this.props.pollInterval);
	  },
	  render: function() {
	    return (
	      React.DOM.div({className: "picBox"}, 
	        React.DOM.h1(null, "#beautifulsky"), 
	        PicList({data: this.state.data}), 
	        PicForm(null)
	      )
	    );
	  }
	});

	React.renderComponent(
	  PicBox({url: "/images", pollInterval: 2000}),
	  document.getElementById('content')
	);
})
