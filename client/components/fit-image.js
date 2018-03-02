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
        backgroundColor: "#000000",
        inputImages: []
    }

    onNewFile = (newFile) => {
        console.log(newFile);
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
            //delete link;
        }


    onSave = () => {
        let dataUrl = this.Konva.getDataURL()
        this.downloadURI(dataUrl, 'screenshot.png')
    }

    onFit = () => {
        this.Konva.fitImage(true)
    }

    onTargetDimsChanged = (newDims) => {
        this.setState({
            targetWidth: newDims.width,
            targetHeight: newDims.height
        })
        // this.Konva.onResizeTarget()
    }

    render = () => {
        let width = window.innerWidth
        let height = window.innerHeight

        return (
            <div id="container" className="container">
                <div className="konva-container">
                    <Playground width={this.state.targetWidth} height={this.state.targetHeight}
                    backgroundColor={this.state.backgroundColor}
                    inputImages={this.state.inputImages}
                    ref={node => {
                      this.Konva = node;
                    }}
                    />
                </div>
                <Menu onNewFile={this.onNewFile}
                        onSave={this.onSave}
                        onFit={this.onFit}
                        onTargetDimsChanged={this.onTargetDimsChanged}
                        />
            </div>

        )
    }
}