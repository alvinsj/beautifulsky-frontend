/** @jsx React.DOM */
function timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";
}

var Pic = React.createClass({displayName: 'Pic',
  render: function() {
    return (
      React.DOM.div({className: "pic"}, 
      	React.DOM.blockquote({className: "picText"}, 
        	React.DOM.div({dangerouslySetInnerHTML: {__html: Autolinker.link(this.props.text)}}), 
        	React.DOM.div({className: "picAuthor"}, 
          		React.DOM.small(null, 
					React.DOM.span({dangerouslySetInnerHTML: {__html: Autolinker.link(this.props.author)}}), 
					", ", timeSince(new Date(this.props.created)), " ago")
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
    map(function (pic, index) {
      return (
        Pic({key: index, author: pic.user, text: pic.tweet, created: pic.created}, 
          React.DOM.div(null, React.DOM.img({src: pic.image_source+"media?size=l", className: "image"}))
        )
      );
    });
    return (
      React.DOM.div({className: "picList", 'data-flex': "horizontal wrap grow"}, 
        picNodes
      )
    );
  }
});

var BeautifulSky = React.createClass({displayName: 'BeautifulSky',
  getInitialState: function() {
    return {data: []};
  },

  loadPicsFromServer: function() {
    	oboe('tweets')
    	.node('!.*', function(pic){
       		var arr = this.state.data;
       		arr.push(pic)
        		this.setState({data: arr});
    	}.bind(this));
  },

  componentDidMount: function() {
    this.loadPicsFromServer();
  },

  render: function() {
    return PicList({data: this.state.data});
  }
});

React.renderComponent(
  BeautifulSky({url: "/images", pollInterval: 2000}),
  document.getElementById('content')
);
