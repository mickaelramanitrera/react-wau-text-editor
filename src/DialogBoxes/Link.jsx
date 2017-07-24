import React, {Component} from 'react';

export default class DraftDialogBox_789789 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            urlValue: props.value
        };
    }

    onChange(event) {
        this.setState({urlValue: event.target.value});
    }

    submitChanges() {
        this.props.onSubmit(this.state.urlValue);
    }

    _onLinkInputKeyDown(e) {
        if (e.which === 13) {
            this.submitChanges();
        }
    }

    render() {
        return (
            <div>
                <div className="drafts-dialog-box">
                    <div className="drafts-dialog-box-content">
                        <h5><i className="material-icons left">link</i>Add/Edit link</h5>
                        <p><input type="text" value={this.state.urlValue} onChange={this.onChange.bind(this)}
                                  autoFocus={true} onKeyDown={this._onLinkInputKeyDown.bind(this)}/></p>
                    </div>
                    <div className="drafts-dialog-box-footer">
                        <a className="btn-floating btn-small grey" onClick={this.props.onDismiss}><i
                            className="material-icons left">clear</i></a>
                        <a className="btn-floating btn-small grey" onClick={this.submitChanges.bind(this)}><i
                            className="material-icons left">check</i></a>
                    </div>
                </div>

                <div className="drafts-dialog-overlay" onClick={this.props.onDismiss}>
                </div>
            </div>
        );
    }
}