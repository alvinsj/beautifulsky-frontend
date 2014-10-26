$(function(){

	var Pic = React.createClass({
	  render: function() {
	    return (
	      <div className="pic">
	      	<blockquote className="picText" >
	        	{this.props.text}
	        	<div className="picAuthor">
	          		<small>{this.props.author}, {moment(this.props.created).fromNow()}</small>
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
	    map(function (pic) {
	      return (
	        <Pic author={pic.user} text={pic.tweet}>
	          <div><img src={pic.image_source+"media?size=l"} className="image" /></div>
	        </Pic>
	      );
	    });
	    return (
	      <div className="picList">
	        {picNodes}
	      </div>
	    );
	  }
	});

	var PicForm = React.createClass({
	  render: function() {
	    return (
	      <div className="picForm">
	       
	      </div>
	    );
	  }
	});


	var PicBox = React.createClass({
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
	      <div className="picBox">
	        <h1>#beautifulsky</h1>
	        <PicList data={this.state.data} />
	        <PicForm />
	      </div>
	    );
	  }
	});

	React.renderComponent(
	  <PicBox url="/images" pollInterval={2000} />,
	  document.getElementById('content')
	);
})
