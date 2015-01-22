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

var Pic = React.createClass({
  render: function() {
    return (
      <div className="pic">
      	<blockquote className="picText" >
        	<div dangerouslySetInnerHTML={{__html: Autolinker.link(this.props.text)}} />
        	<div className="picAuthor">
          		<small>
					<span dangerouslySetInnerHTML={{__html: Autolinker.link(this.props.author)}} />
					, {timeSince(new Date(this.props.created))} ago</small>
        	</div>
        </blockquote>

        {this.props.children}
      </div>
    );
  }
});

var PicList = React.createClass({
  render: function() {
    var picNodes = this.props.data.
    filter(function(pic){ return pic.image_source.indexOf("instagram") > -1 }).
    map(function (pic, index) {
      return (
        <Pic key={index} author={pic.user} text={pic.tweet} created={pic.created} >
          <div><img src={pic.image_source+"media?size=l"} className="image" /></div>
        </Pic>
      );
    });
    return (
      <div className="picList" data-flex="horizontal wrap grow">
        {picNodes}
      </div>
    );
  }
});

var BeautifulSky = React.createClass({
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
    return <PicList data={this.state.data} />;
  }
});

React.renderComponent(
  <BeautifulSky url="/images" pollInterval={2000} />,
  document.getElementById('content')
);
