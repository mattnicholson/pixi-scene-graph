import React, { Component } from 'react';

//import {withStore} from './Store';


class RenderLoop extends Component {

  ticker;
  stopped=1;

  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() {
    
    this.startLoop();
   
  }

  componentWillUnmount() {
 
    this.stopLoop();
  }


  startLoop = () => {

    this.stopped = 0;
    this.loop();

  }

  stopLoop = ()=> {
    this.stopped = 1;
    cancelAnimationFrame(this.ticker);


  }

  loop = () => {
   
    if(this.stopped) return;
    this.onFrame();
    this.ticker = requestAnimationFrame(this.loop)
  }

  /*
  
  Ticker...

*/

onFrame = () =>{

  if(this.props.onFrame) this.props.onFrame(this);

}

  /*

    RENDER

  */

  render() {
   
    return this.props.children || null;

  }
}

export default RenderLoop;
