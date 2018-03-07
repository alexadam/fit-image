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
        console.log('new sims', newDims);
        this.props.onTargetDimsChanged(newDims)
    }

    render = () => {
        return (
            <div className="menu">
                <div>
                    <label>Target Dimensions</label>
                </div>
                <div>
                    <label>Width:</label><input type="number" ref={(c)=>this.tWidth=c} />
                </div>
                <div>
                    <label>Height:</label><input type="number" ref={(c)=>this.tHeight=c}/>
                </div>
                <div>
                    <button onClick={this.onDimenstionsChanged}>Apply</button>
                </div>
                <div>
                    <input type="file" onChange={this.onFileUpload} />
                </div>
                <div>
                    <label>Background Color:</label><input type="color" onChange={this.props.onBgColorChange} />
                </div>
                <div>
                    <button onClick={this.props.onFit}>Fit</button>
                </div>
                <div>
                    <button onClick={this.props.onSave}>Save...</button>
                </div>
            </div>
        )
    }
}
