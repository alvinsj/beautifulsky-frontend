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
    getInitialState: function(){
        return {showText: false}
    },
    render: function() {
        return (
            React.DOM.div({className: "pic", 
                onTouchStart: this._handleTouchStart, 
                onTouchEnd: this._handleTouchEnd, 
                onMouseEnter: this._handleTouchStart, 
                onMouseLeave: this._handleTouchEnd}, 
                React.DOM.blockquote({
                    className: "picText"+(this.state.showText ? ' hover' : '')}, 
                    React.DOM.div({dangerouslySetInnerHTML: {__html: Autolinker.link(this.props.text)}}), 
                    React.DOM.div({className: "picAuthor"}, 
                        React.DOM.small(null, 
                            React.DOM.span({dangerouslySetInnerHTML: {__html: Autolinker.link(this.props.author)}}), 
                            ", ", timeSince(new Date(this.props.created)), " ago"
                        )
                    )
                ), 
                this.props.children
            )
            );
        },
        _handleTouchStart: function(){
            this.setState({showText: true})
        },
        _handleTouchEnd: function(){
            this.setState({showText: false})
        }
    });

    var PicList = React.createClass({displayName: 'PicList',
        render: function() {
            var calc = {instagram: 0, twimg: 0, display: 0};
            var picNodes = this.props.data
            .filter(function(pic){
                var instagram = pic.image_source.indexOf("www.instagram") > -1;
                var twimg = pic.image_source.indexOf("pbs.twimg") > -1;
                calc["instagram"] += instagram ? 1 : 0;
                calc["twimg"] += twimg ? 1 : 0;
                return instagram || twimg;
            });
            // reverse
            var index, elements = [];
            for(index = picNodes.length-1; index > -1 ; index-- ) {
                var pic = picNodes[index];
                if(pic.image_source.indexOf("https://www.instagram") > -1
                && pic.image_source.indexOf("media?size=l") == -1) {
                    pic["image_source"]= pic.image_source + "media?size=l"
                }

                elements.push(
                    Pic({key: index, author: pic.user, text: pic.tweet, created: pic.created}, 
                        React.DOM.div(null, React.DOM.img({src: pic.image_source, className: "image"}))
                    )
                );
            }
            calc.display = elements.length;

            return (
                React.DOM.div({className: "picList", 'data-flex': "horizontal wrap grow"}, 
                    elements
                )
            );
        }
    });

    var BeautifulSky = React.createClass({displayName: 'BeautifulSky',
        getInitialState: function() {
            return {data: [], indexes: {}, duplicates: 0};
        },

        loadPicsFromServer: function() {
            oboe('tweets')
            .node('!.*', function(pic){
                var data = this.state.data;
                var indexes = this.state.indexes;
                var newData = data;
                var duplicates = this.state.duplicates

                if(!indexes[pic.tweet_id]){
                    indexes[pic.tweet_id] = true

                    var i = _.sortedIndex(data, pic,
                        function(item){ return new Date(item.created).getTime() });
                    var newData = _.initial(data, data.length-i)
                        .concat([pic])
                        .concat(_.rest(data, i));

                }else{
                    duplicates += 1;
                }

                this.setState({
                    duplicates: duplicates,
                    indexes: indexes,
                    data: newData
                });
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
