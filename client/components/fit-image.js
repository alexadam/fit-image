import React from "react";
import Menu from './menu';
import Playground from './playground';

export default class FitImage extends React.Component {
    constructor(props) {
        super(props)
    }

    state = {
        targetWidth: 800,
        targetHeight: 600,
        scaleWidth: 800,
        scaleHeight: 600,
        scaleFactorH: 1,
        scaleFactorW: 1,
        backgroundColor: "#ffffff",
        inputImages: []
    }

    componentDidMount = () => {
        window.addEventListener('resize', this.resizeKonva);
        this.resizeKonva()
    }

    resizeKonva = (event, targetW = this.state.targetWidth, targetH = this.state.targetHeight) => {
        let container = document.querySelector('#container');
        let scale = 1;

        let scaleW = container.offsetWidth / targetW;
        let scaleH = container.offsetHeight / targetH;

        if (scaleW >= 1) scaleW = 1;
        if (scaleH >= 1) scaleH = 1;

        if (targetW > targetH) {
            scaleH = scaleW
        } else {
            scaleW = scaleH
        }

        this.Konva.scaleStageResponsive(scale)

        this.setState({
            scaleWidth: targetW * scaleW,
            scaleHeight: targetH * scaleH,
            scaleFactorW: scaleW,
            scaleFactorH: scaleH,
        })
    }

    onNewFile = (newFile) => {
        this.setState({
            inputImages: [newFile]
        })
    }

    downloadURI = (uri, name) => {
            let link = document.createElement("a");
            link.download = name;
            link.href = uri;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

    onSave = () => {
        let dataUrl = this.Konva.getDataURL()
        this.downloadURI(dataUrl, 'screenshot.png')
    }

    onFit = () => {
        this.Konva.fitImage(true)
    }
    onCenter = () => {
        this.Konva.centerImage()
    }

    onTargetDimsChanged = (newDims) => {
        this.setState({
            targetWidth: newDims.width,
            targetHeight: newDims.height,
            scaleWidth: newDims.width * this.state.scaleFactorW,
            scaleHeight: newDims.height * this.state.scaleFactorH
        })
        this.resizeKonva(null, newDims.width, newDims.height)
    }
    onBgColorChange = (newColor) => {
        this.setState({
            backgroundColor: newColor
        })
    }

    render = () => {
        let width = window.innerWidth
        let height = window.innerHeight

        return (
            <div id="container" className="container">
                <Menu onNewFile={this.onNewFile}
                    onSave={this.onSave}
                    onFit={this.onFit}
                    onTargetDimsChanged={this.onTargetDimsChanged}
                    onBgColorChange={this.onBgColorChange}
                    onCenter={this.onCenter}
                    />
                <div className="konva-container">
                    <Playground
                    width={this.state.scaleWidth} height={this.state.scaleHeight}
                    targetWidth={this.state.targetWidth} targetHeight={this.state.targetHeight}
                    backgroundColor={this.state.backgroundColor}
                    inputImages={this.state.inputImages}
                    ref={node => {
                      this.Konva = node;
                    }}
                    />
                </div>

            </div>

        )
    }
}
