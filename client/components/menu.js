import React from "react";

export default class Menu extends React.Component {
    constructor(params) {
        super(params)
    }

    state = {
        targetWidth: 800,
        targetHeight: 600,
        backgroundColor: '#ffffff',
        expanded: false
    }

    onFileUpload = () => {
        let file = document.querySelector('input[type=file]').files[0];
        let reader = new FileReader();

        reader.addEventListener("load", () => {
            this.props.onNewFile(reader.result, file.name)
        }, false);

        if (file) {
            reader.readAsDataURL(file);
        }
    }

    onDimenstionsChanged = () => {
        let newDims = {
            width: this.state.targetWidth,
            height: this.state.targetHeight
        }
        this.props.onTargetDimsChanged(newDims)
    }

    onBgColorChange = (event) => {
        let color = event.target.value + ''
        this.setState({
            backgroundColor: color
        })
        this.props.onBgColorChange(color)
    }

    toggleExpand = () => {
        this.setState({
            expanded: !this.state.expanded
        })
    }

    onWidthChange = (e) => {
        this.setState({
            targetWidth: e.target.value
        })
    }
    onHeightChange = (e) => {
        this.setState({
            targetHeight: e.target.value
        })
    }

    render = () => {
        let menu = <button className="menu-button" onClick={this.toggleExpand}>Show Options...</button>

        if (this.state.expanded) {
            menu = <div className="menu">
                <button className="menu-button" onClick={this.toggleExpand}>Hide Options</button>
                <div className="menu-group">
                    <div className="menu-sub-group">
                        <label className="menu-label">Target Width:</label>
                        <input type="number" className="menu-number-input" onChange={this.onWidthChange} value={this.state.targetWidth}/>
                    </div>
                    <div className="menu-sub-group">
                        <label className="menu-label">Target Height:</label>
                        <input type="number" className="menu-number-input" onChange={this.onHeightChange} value={this.state.targetHeight}/>
                    </div>
                    <button className="menu-button" onClick={this.onDimenstionsChanged}>Apply</button>
                </div>
                <div className="menu-group">
                    <span>{this.props.inputImagesName[0] ? this.props.inputImagesName[0] : ''}</span>
                    <label className="menu-button">Open Image...<input type="file" className="menu-button menu-file-input" onChange={this.onFileUpload} /></label>
                </div>
                <div className="menu-group">
                    <label className="menu-label">Background Color:</label>
                    <input type="color" className="menu-button" value={this.state.backgroundColor} onChange={this.onBgColorChange} />
                </div>
                <div className="menu-group">
                    <button className="menu-button" onClick={this.props.onFit}>Fit Image to Target</button>
                </div>
                <div className="menu-group">
                    <button className="menu-button" onClick={this.props.onCenter}>Center Image</button>
                </div>
                <div className="menu-group">
                    <button className="menu-button" onClick={this.props.onSave}>Save...</button>
                </div>
            </div>
        }

        return (
            <div>
                {menu}
            </div>
        )
    }
}
