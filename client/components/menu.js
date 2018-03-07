import React from "react";

export default class Menu extends React.Component {
    constructor(params) {
        super(params)
    }

    state = {
        targetWidth: 800,
        targetHeight: 600
    }

    componentDidMount = () => {
        this.tWidth.value = 800
        this.tHeight.value = 600
    }

    onFileUpload = () => {
        let file    = document.querySelector('input[type=file]').files[0];
        let reader  = new FileReader();

        reader.addEventListener("load", () => {
            this.props.onNewFile(reader.result)
          }, false);

          if (file) {
            reader.readAsDataURL(file);
          }
    }

    onDimenstionsChanged = () => {
        let newDims = {
            width: this.tWidth.value,
            height: this.tHeight.value
        }
        this.props.onTargetDimsChanged(newDims)
    }

    render = () => {
        return (
            <div className="menu">
                <div className="menu-group">
                    <label className="menu-label">Target Width:</label>
                    <input type="number" className="menu-number-input" ref={(c)=>this.tWidth=c} />
                    <label className="menu-label">Target Height:</label>
                    <input type="number" className="menu-number-input" ref={(c)=>this.tHeight=c}/>
                    <button className="menu-button" onClick={this.onDimenstionsChanged}>Apply</button>
                </div>
                <div className="menu-group">
                    <input type="file" className="menu-button menu-file-input" onChange={this.onFileUpload} />
                </div>
                <div className="menu-group">
                    <label className="menu-label">Background Color:</label>
                    <input type="color" className="menu-button" onChange={this.props.onBgColorChange} />
                </div>
                <div className="menu-group">
                    <button className="menu-button" onClick={this.props.onFit}>Fit</button>
                </div>
                <div className="menu-group">
                    <button className="menu-button" onClick={this.props.onCenter}>Center</button>
                </div>
                <div className="menu-group">
                    <button className="menu-button" onClick={this.props.onSave}>Save...</button>
                </div>
            </div>
        )
    }
}
