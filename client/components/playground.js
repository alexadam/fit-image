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
    render = () => {
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

    onLoad = (groupName) => {
        let group = this.layer.get('.' + groupName)[0]
        let image = group.get('Image')[0];
        let width = image.width()
        let height = image.height()
        let topRight = group.get('.topRight')[0];
        let bottomRight = group.get('.bottomRight')[0];
        let bottomLeft = group.get('.bottomLeft')[0];

        topRight.setX(width)
        topRight.setY(0)

        bottomRight.setX(width)
        bottomRight.setY(height)

        bottomLeft.setX(0)
        bottomLeft.setY(height)
    }

    getDataURL = () => {
        let group = this.layer.get('.' + "group1")[0]
        let topLeft = group.get('.topLeft')[0];
        let topRight = group.get('.topRight')[0];
        let bottomRight = group.get('.bottomRight')[0];
        let bottomLeft = group.get('.bottomLeft')[0];

        topLeft.setVisible(false)
        topRight.setVisible(false)
        bottomRight.setVisible(false)
        bottomLeft.setVisible(false)

        this.layer.draw()

        let dataUrl = this.stage.getStage().toDataURL()

        topLeft.setVisible(true)
        topRight.setVisible(true)
        bottomRight.setVisible(true)
        bottomLeft.setVisible(true)

        this.layer.draw()

        return dataUrl
    }

    fitImage = (isFit) => {
        //TODO
        this.onDragMove("group1", {
            getName: () => "bottomRight",
            getX: () => this.props.width,
            getY: () => this.props.height,
        })

        this.onLoad("group1")

    }

  render() {
    return (
      <Stage width={this.props.width}
            height={this.props.height}
            backgroundColor={this.props.backgroundColor}
            ref={node => {
              this.stage = node;
            }}
            >
        <Layer
        ref={node => {
          this.layer = node;
        }}>
            <Rect x="0" y="0" width={this.props.width} height={this.props.height} fill={this.props.backgroundColor}/>
            <ImageGroup src={this.props.inputImages[0]}
                groupName="group1"
                width={this.props.width}
                height={this.props.height}
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