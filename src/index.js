import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
    render() {
      return (
        <button className="square" style={this.props.style} onClick={() => this.props.onClick()}>
            {this.props.value}          
        </button>
      );
    }
  }

class Row extends React.Component {
    renderSquares(n){
        let output = [];
        for (let i = 0; i<n; ++i){
            output.push(this.renderSquare(i));
        }
        return output
    }

    render(){
        return (
            <div className="board-row">
                 {this.renderSquares(8)}
            </div>
        );
    }
}
  
class Board extends React.Component {
    constructor(props) {
        super(props);
        let stater = Array(100).fill('white');
        this.state = {
            squares: stater,
            lastSelection: null,
            anim: false,
            score: 0,
            resettag: 'Start!',
            h:8,
            w:8,
        };
    }

    adjacent(i,j){
        return  (i === j+1 && (j+1)%this.state.w !== 0) || (i === j-1 && (j)%this.state.w !== 0) || i === j+this.state.w || i === j-this.state.w
    }

    clearFruits(squares){
        const match = Array(100).fill(0);
        let r = this.state.h; let c = this.state.w;
        let done = true;
        let points = 0; 
        for (let i = 0; i<r; ++i){
            for (let j = 0; j<c-2; ++j){
                if (( squares[i+j*c] === squares[i+(j+1)*c]) && 
                    ( squares[i+j*c] === squares[i+(j+2)*c]) &&
                    ( squares[i+j*c] != 'black' )){
                    match[i+j*c] = 1;
                    match[i+(j+1)*c] = 1;
                    match[i+(j+2)*c] = 1;
                    done = false;
                }
            }
        }

        for (let i = 0; i<r-2; ++i){
            for (let j = 0; j<c; ++j){
                if (( squares[i+j*c] === squares[i+1+j*c] ) && 
                    ( squares[i+j*c] === squares[i+2+j*c] ) &&
                    ( squares[i+j*c] != 'black' )){
                    match[i+j*c] = 1;
                    match[i+1+j*c] = 1;
                    match[i+2+j*c] = 1;
                    done = false;
                }
            }
        }
        for (let i = 0; i<r; ++i){
            for (let j = 0; j<c; ++j){
                if (match[i+j*c] === 1){
                    squares[i+j*c] = 'grey'
                    points = points+1
                }
            }
        }
        if (!done){
            this.setState( () => ({squares: squares, score: this.state.score+points }), () => setTimeout(() => this.percolate(squares, match), 1000) )
            return true
        } else {
            this.setState( () => ({anim: false}));
            return false
        }
    }

    percolate(squares, match){
        let r = this.state.h; let c = this.state.w;
        for (let i = 0; i<r; ++i){
            for (let j = 0; j<c; ++j){
                if (match[i+j*c] === 1){
                    let perc = true
                    let x = i
                    let y = j
                    while (perc){
                        if (y === 0 || (squares[x+(y-1)*c] === 'black')){
                            squares[x+y*c] = 'black';
                            perc = false;
                        } else {
                            let tmp = squares[x+(y-1)*c];
                            squares[x+y*c] = squares[x+(y-1)*c];
                            squares[x+(y-1)*c] = tmp;
                            y = y - 1;
                        }
                    }
                }
            }
        }
        this.setState( () => ({squares: squares}), () => setTimeout( () => this.refill(squares), 1000 ) )

    }    
    
    refill(squares){
        for ( let i = 0; i < 100; ++i){
            if (squares[i] == 'black'){
                squares[i] = getColor();
            }
        }
        this.setState( () => ({squares: squares}), () => setTimeout( () => this.clearFruits(squares), 500 ) )
    }

    handleClick(i){
        if (this.state.anim){
            return
        }
        const squares = this.state.squares.slice();
        let moved = false
        if ((this.adjacent(i,this.state.lastSelection)) &&
            (squares[i] != 'black') && squares[this.state.lastSelection] != 'black'){
            squares[i] = this.state.squares[this.state.lastSelection];
            squares[this.state.lastSelection] = this.state.squares[i];
            moved = true;
        }
        if (moved){
            this.setState(() => ({
                anim: true,
                lastSelection: null,
            }), () => this.clearFruits(squares))
        } else {
            this.setState(() => ({
                lastSelection: i, 
            }))
        }
    }

    renderRows(n){
        let rows = []
        for (let i = 0; i < n; ++i){
            rows.push( this.renderRow(i,n) )
        }
        return rows
    }

    renderRow(j,n) {
      let output = [];
      for (let i = 0; i<n; ++i){
        let q = i+j*this.state.w
        output.push(this.renderSquare(q));
        }
      return ( <div className="board-row">
          {output}
          </div>
      )
    }

    renderSquare(i){
        let styles = {
            backgroundColor: this.state.squares[i]
        }
        //return this.state.squares[i]
        //return i
        return <Square 
            style={styles}
            onClick={() => this.handleClick(i)}
            />;
    }

    reset() {
        let stater = Array(100);
        for (let i = 0; i<100; ++i){
            stater[i] = getColor()
        }
        this.setState ({
            squares: stater,
            lastSelection: null,
            anim: true,
            score: 0,
            resettag: "Reset",
        }, () => setTimeout( () => this.clearFruits(stater), 1000 ) );
    }
  
    render() {
      const status = 'FRUIT IS EXTRA!        SCORE: ' + this.state.score;
  
      return (
        <div>
          <div className="status">{status}</div>
          {this.renderRows(8)}
          <button onClick={()=>this.reset()} > {this.state.resettag}</button>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    render() {
      return (
        <div className="game">
          <div className="game-board">
            <Board />
          </div>
          <div className="game-info">
            <div>{/* status */}</div>
            <ol>{/* TODO */}</ol>
          </div>
        </div>
      );
    }
  }
 
  function getColor(){
      const colors = ['red','orange','yellow','green','blue','purple','white']
      let index = Math.floor(Math.random()*colors.length)
      return colors[index]
  }
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  