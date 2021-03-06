import React, { Component } from "react";
import { Stage, Layer, Image, Group, Circle, Rect } from "react-konva";


class ImageComponent extends React.Component {
  state = {
    image: null
  };

  componentDidMount = () => {
        const image = new window.Image();
        image.src = this.props.src;
        image.onload = () => {
            this.setState({
                image: image
            });
            this.props.onLoad(this.props.groupName, {
                width: image.width,
                height: image.height
            })
        };
    }


  componentWillReceiveProps = (nextProps) => {
      const image = new window.Image();
      image.src = nextProps.src;
      image.onload = () => {
          this.setState({
              image: image
          });
          nextProps.onLoad(nextProps.groupName, {
              width: image.width,
              height: image.height
          })
      };
  }

  render() {
    return <Image image={this.state.image} name="Image" />;
  }
}

class Handler extends Component {
    constructor(props) {
        super(props)
    }
    onDragMove = () => {
        this.props.onDragMove(this.props.groupName, this.handler)
    }
    render = () => {
        return <Circle x={this.props.x}
                y={this.props.y}
                fill="#ddd"
                stroke="#000"
                strokeWidth="2"
                radius="8"
                draggable="true"
                dragOnTop="false"
                name={this.props.name}
                ref={node => {
                  this.handler = node;
                }}
                onMouseOver={()=>{
                    document.body.style.cursor = 'pointer';
                }}
                onMouseOut={()=>{
                    document.body.style.cursor = 'default';
                }}
                onDragMove={this.onDragMove}
                />
    }
}

class ImageGroup extends Component {
    shouldComponentUpdate = (nextProps) => {
        if (nextProps.targetWidth !== this.props.targetWidth || nextProps.targetHeight !== this.props.targetHeight) {
            return false
        }
        return true
    }

    render = () => {
        if (!this.props.src) return null

        return (
            <Group draggable="true"
                name={this.props.groupName}
                ref={node => {
                  this.group = node;
                }}
                onMouseDown={()=>{this.group.moveToTop()}}>
                <ImageComponent
                    width={this.props.width}
                    height={this.props.height}
                    groupName={this.props.groupName}
                    src={this.props.src}
                    onLoad={this.props.onLoad} />
                <Handler name="topLeft" groupName={this.props.groupName}
                      x={0} y={0} onDragMove={this.props.onDragMove} />
                <Handler name="topRight" groupName={this.props.groupName}
                      x={0} y={0} onDragMove={this.props.onDragMove} />
                <Handler name="bottomRight" groupName={this.props.groupName}
                      x={0} y={0} onDragMove={this.props.onDragMove} />
                <Handler name="bottomLeft" groupName={this.props.groupName}
                      x={0} y={0} onDragMove={this.props.onDragMove} />
            </Group>
        )
    }
}

export default class Playground extends Component {
    constructor(props) {
        super(props)
    }

    onDragMove = (groupName, activeAnchor) => {
        let group = this.layer.get('.' + groupName)[0]
        let topLeft = group.get('.topLeft')[0];
        let topRight = group.get('.topRight')[0];
        let bottomRight = group.get('.bottomRight')[0];
        let bottomLeft = group.get('.bottomLeft')[0];
        let image = group.get('Image')[0];

        let anchorX = activeAnchor.getX();
        let anchorY = activeAnchor.getY();

        switch (activeAnchor.getName()) {
            case 'topLeft':
                topRight.setY(anchorY);
                bottomLeft.setX(anchorX);
                break;
            case 'topRight':
                topLeft.setY(anchorY);
                bottomRight.setX(anchorX);
                break;
            case 'bottomRight':
                bottomLeft.setY(anchorY);
                topRight.setX(anchorX);
                break;
            case 'bottomLeft':
                bottomRight.setY(anchorY);
                topLeft.setX(anchorX);
                break;
        }

        image.position(topLeft.position());

        var width = topRight.getX() - topLeft.getX();
        var height = bottomLeft.getY() - topLeft.getY();
        if(width && height) {
            image.width(width);
            image.height(height);
        }

        group.moveToTop()

        this.layer.draw()
    }

    onLoad = (groupName, originalDims) => {
        let group = this.layer.get('.' + groupName)[0]
        let image = group.get('Image')[0];
        let width = image.width()
        let height = image.height()

        let initRatio = width / height

        if (this.props.width > width) {
            let diff = this.props.width * originalDims.width / this.props.targetWidth
            image.width(diff)
            image.height(diff / initRatio)
        }

        if (this.props.height > height) {
            let diff = this.props.height * originalDims.height / this.props.targetHeight
            image.height(diff)
            image.width(diff * initRatio)
        }

        width = image.width()
        height = image.height()

        let topLeft = group.get('.topLeft')[0];
        let topRight = group.get('.topRight')[0];
        let bottomRight = group.get('.bottomRight')[0];
        let bottomLeft = group.get('.bottomLeft')[0];

        let imgPos = image.position()
        let px = imgPos.x
        let py = imgPos.y

        topLeft.setX(px)
        topLeft.setY(py)

        topRight.setX(px + width)
        topRight.setY(py)

        bottomRight.setX(px + width)
        bottomRight.setY(py + height)

        bottomLeft.setX(px)
        bottomLeft.setY(py + height)
    }

    getDataURL = () => {
        let scale = this.props.targetWidth / this.props.width
        let scaleW = this.props.targetWidth / this.props.width
        let scaleH = this.props.targetHeight / this.props.height

        if (scale > 1) {
            this.stage.getStage().width(this.props.targetWidth)
            this.stage.getStage().height(this.props.targetHeight)
            this.stage.getStage().scale({ x: scale, y: scale });
            this.stage.getStage().draw();
        }

        let group = this.layer.get('.' + "group1")[0]

        if (!group) {
            let dataUrl = this.layer.toDataURL()
            if (scale > 1) {
                this.stage.getStage().width(this.props.width)
                this.stage.getStage().height(this.props.height)
                this.stage.getStage().scale({ x: 1, y: 1 });
                this.stage.getStage().draw();
            }
            return dataUrl
        }

        let topLeft = group.get('.topLeft')[0];
        let topRight = group.get('.topRight')[0];
        let bottomRight = group.get('.bottomRight')[0];
        let bottomLeft = group.get('.bottomLeft')[0];

        topLeft.setVisible(false)
        topRight.setVisible(false)
        bottomRight.setVisible(false)
        bottomLeft.setVisible(false)

        this.layer.draw()

        let dataUrl = this.layer.toDataURL()

        topLeft.setVisible(true)
        topRight.setVisible(true)
        bottomRight.setVisible(true)
        bottomLeft.setVisible(true)

        this.layer.draw()

        if (scale > 1) {
            this.stage.getStage().width(this.props.width)
            this.stage.getStage().height(this.props.height)
            this.stage.getStage().scale({ x: 1, y: 1 });
            this.stage.getStage().draw();
        }

        return dataUrl
    }

    fitImage = (isFit) => {
        let group = this.layer.get('.' + "group1")[0]
        let topLeft = group.get('.topLeft')[0];
        let topRight = group.get('.topRight')[0];
        let bottomRight = group.get('.bottomRight')[0];
        let bottomLeft = group.get('.bottomLeft')[0];
        let image = group.get('Image')[0];

        group.position(
            {
                x: 0,
                y: 0
            }
        )

        topLeft.position({
            x: 0,
            y: 0
        })
        topRight.position({
            x: this.props.width,
            y: 0
        })
        bottomRight.position({
            x: this.props.width,
            y: this.props.height
        })
        bottomLeft.position({
            x: 0,
            y: this.props.height
        })

        image.position(topLeft.position());
        image.width(this.props.width)
        image.height(this.props.height)

        group.moveToTop()

        this.layer.draw()

    }

    centerImage = () => {
        let group = this.layer.get('.' + "group1")[0]
        let topLeft = group.get('.topLeft')[0];
        let topRight = group.get('.topRight')[0];
        let bottomRight = group.get('.bottomRight')[0];
        let bottomLeft = group.get('.bottomLeft')[0];
        let image = group.get('Image')[0];
        let width = image.width()
        let height = image.height()

        group.position(
            {
                x: 0,
                y: 0
            }
        )

        topLeft.position({
            x: this.props.width/2 - width/2,
            y: this.props.height/2 - height/2
        })
        topRight.position({
            x: this.props.width/2 + width/2,
            y: this.props.height/2 - height/2
        })
        bottomRight.position({
            x: this.props.width/2 + width/2,
            y: this.props.height/2 + height/2
        })
        bottomLeft.position({
            x: this.props.width/2 - width/2,
            y: this.props.height/2 + height/2
        })

        image.position(topLeft.position());
        group.moveToTop()

        this.layer.draw()
    }

    changeBgColor = (newColor) => {
        let rect = this.layer.get(".background")[0]
        rect.fill(newColor)
        this.layer.draw()
    }

    scaleStageResponsive = (scale) => {
        // this.stage.getStage().width(this.props.width)
        // this.stage.getStage().height(this.props.height)
        // this.stage.getStage().draw();
        // this.stage.getStage().scale({ x: scale, y: scale });
        // this.stage.getStage().draw();
        // this.layer.draw()
        // let group = this.layer.get('.' + "group1")[0]
        // if (!group) return
        // group.scale({ x: scale, y: scale })
        // this.layer.draw()
    }

  render() {
    return (
      <Stage
        className="konva-stage"
            width={this.props.width}
            height={this.props.height}
            targetWidth={this.props.targetWidth}
            targetHeight={this.props.targetHeight}
            backgroundColor={this.props.backgroundColor}
            ref={node => {
              this.stage = node;
            }}
            >
        <Layer
            ref={node => {
              this.layer = node;
            }}>
            <Rect x="0" y="0" name="background"
                    width={this.props.width}
                    height={this.props.height}
                    fill={this.props.backgroundColor}
                    />
            <ImageGroup src={this.props.inputImages[0]}
                groupName="group1"
                width={this.props.width}
                height={this.props.height}
                targetWidth={this.props.targetWidth}
                targetHeight={this.props.targetHeight}
                onLoad={this.onLoad}
                onDragMove={this.onDragMove}
                ref={node => {
                  this.group1 = node;
                }}/>

        </Layer>
      </Stage>
    );
  }
}
