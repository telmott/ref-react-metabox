'use strict';

var element = React.createElement;
var metabox = document.getElementById('post-references');
var metaboxInside = metabox.getElementsByClassName('inside')[0];

class Button extends React.Component {
    render() {
        return(
            element('a', {className: "button " + this.props.size + " " + this.props.context, onClick: this.props.onClick}, this.props.value)
        )
    }
}

class InputField extends React.Component {
    render() {
        return(
            element('div', {key: this.props.name + '-wraper'}, [
                element('label', {key: this.props.name + '-label', htmlFor: this.props.name}, this.props.name + ':'),
                element('input', {key: this.props.name + '-input', name: this.props.name, value: this.props.value, onChange: this.props.onChange}, null)
            ])
        )
    }
}

class ReferenceItem extends React.Component {
    constructor() {
        super();
        this.state = {
            metaId: '',
            title: '',
            url: ''
        }
        this.handleSaveRef = this.handleSaveRef.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleSaveRef(event) {
        event.preventDefault();
        this.serverRequest = jQuery.ajax({
            url: wpApiSettings.root + 'wp/v2/posts/' + postId.val + '/meta',
            method: 'POST',
            beforeSend: function (xhr) {
                xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
            },
            data: {
                "key": "reference",
                "value": JSON.stringify({tite: this.state.title, url:this.state.url})
            }
        }).done( function(result) {
                this.setState({
                    metaId: result.id
                })
            }.bind(this)
        )

    }

    handleInputChange(event) {
        var target = event.target;
        var value = target.value;
        var name = target.name;

        this.setState({
            [name]: value
        })
    }

    render() {
        return(
            element('li', {key: this.props.id + 1, className: "ref-list-item",}, [
                element('form', {key: this.props.id + 2}, [
                    element(InputField, {key: 'title-wraper' + this.props.id, id: this.props.id, name: "title", onChange: this.handleInputChange, value: this.state.title}, null),
                    element(InputField, {key: 'url-wraper' + this.props.id, id: this.props.id, name: "url", onChange: this.handleInputChange, value: this.state.url}, null),
                    element('div', {key: this.props.id + 3}, [
                        element(Button, {key: this.props.id + 4, size: "button-small", context: "button-primary", onClick: this.handleSaveRef, value: "Save"}, null),
                        element(Button, {key: this.props.id + 5, size: "button-small", onClick: this.props.handleDelRef, value: "Delete"}, null)
                    ])
                ])
            ])
        );
    }
        
}

class ReferenceMetabox extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            referenceList: []
        };
        this.handleAddRef = this.handleAddRef.bind(this);
        this.handleDelRef = this.handleDelRef.bind(this);
    }

    componentDidMount() {

    }

    handleAddRef(event) {
        event.preventDefault();
        this.setState({
            totalRef: this.state.referenceList.push(
                element(ReferenceItem, {
                    key: this.state.referenceList.length + 1,
                    id: this.state.referenceList.length + 1,
                    handleDelRef: this.handleDelRef
                }, null)
            )
        });
    }

    handleDelRef(event) {
        event.preventDefault();
        var target = event.target;

        // delete the meta

        this.setState({
            referenceList: this.state.referenceList.filter(function(ref) {
                return ref.id != target.id;
            })
        });
    }

    render() {
        return(
            element('div', {
                key: "0",
                className: "ref-metabox-inner"
            }, [
                element('ul', {key: "0.1", className: ""}, this.state.referenceList),
                element(Button, {key: "0.2", context: "button-default", onClick: this.handleAddRef, value: "Add Reference"}, null)
            ])
        );
    }
}

ReactDOM.render(
    element(ReferenceMetabox, null, null),
    metaboxInside
);