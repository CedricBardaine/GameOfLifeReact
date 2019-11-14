import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import { ButtonToolbar, Dropdown, DropdownButton } from 'react-bootstrap' ; 

class Box extends React.Component {
    selectBox = () =>{
        this.props.selectBox(this.props.row , this.props.col)
    }
    render() {
        return(
            <div 
            className = {this.props.boxClass} 
            id = {this.props.id}
            onClick = {this.selectBox} 
            />

        );
    }
}

class Grid extends React.Component {
    render() {
        const width = (this.props.cols * 14 + 1) ; 
        var rowsArr = [] ; 
        
        var boxClass = "" ; 
        for (var i=0 ; i < this.props.rows ; i++ ) {
            for (var j=0 ; j < this.props.cols ; j++ ) {
                let boxId = i + "_" + j ; 
                boxClass = this.props.gridFull[i][j] ? "box on" : "box off"  ;
                rowsArr.push(
                    <Box 
                    boxClass={boxClass}
                    key = {boxId}
                    boxId = {boxId}
                    row = {i} 
                    col = {j}
                    selectBox = {this.props.selectBox}
                    />
                );
            }
        }
        
        return(
            <div className="grid" style={{width: width}}>
            {rowsArr}
            </div>
            )
        }
    }

    class Buttons extends React.Component {
        handleSelect = (e) => {
            this.props.gridSize(e) ; 
        }

        render() {
            return(
                <div className="center">
                    <ButtonToolbar>
                        <button className="btn btn-default" onClick={this.props.playButton}>Play</button>
                        <button className="btn btn-default" onClick={this.props.pauseButton}>Stop</button>
                        <button className="btn btn-default" onClick={this.props.clear}>Clear</button>
                        <button className="btn btn-default" onClick={this.props.slow}>Slower</button>
                        <button className="btn btn-default" onClick={this.props.fast}>Faster</button>
                        <button className="btn btn-default" onClick={this.props.seed}>New</button>
                        <DropdownButton 
                        title = "Grid Size"
                        id = "size-menu" 
                        onSelect = {this.handleSelect}
                        >
                        <Dropdown.Item eventKey="1">20x10</Dropdown.Item>
                        <Dropdown.Item eventKey="2">50x30</Dropdown.Item>
                        <Dropdown.Item eventKey="3">70x50</Dropdown.Item>
                        </DropdownButton>
                    </ButtonToolbar>
                </div>
            )
        }
    }
    
    class Main extends React.Component {
        constructor() {
            super();
            this.speed = 100 ; 
            this.rows = 30 ; 
            this.cols = 50 ; 
            
            this.state = {
                generation: 0,
                gridFull: Array(this.rows).fill().map( () => Array(this.cols).fill(false)) 
            }
        }

        selectBox = (row , col) => {
            let gridCopy = arrayClone(this.state.gridFull) ; 
            gridCopy[row][col] = !gridCopy[row][col] ; 
            this.setState( {
                gridFull: gridCopy
            });
        }

        seed = () => {
            let gridCopy = arrayClone(this.state.gridFull) ; 
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    if (Math.floor(Math.random() *4) === 1) gridCopy[i][j] = true;
                }
            }
            this.setState( {
                gridFull: gridCopy
            });
        }

        playButton = () => {
            clearInterval(this.intervalId) ; 
            this.intervalId = setInterval(this.play, this.speed) ;
        }
        pauseButton = () => {
            clearInterval(this.intervalId) ; 
        }
        slow = () => {
            this.speed = this.speed *1.3 ; 
            console.log("Vitesse actuelle : "+this.speed) ; 
            this.playButton() ;
        }
        fast = () => {
            this.speed = this.speed / 1.3 ; 
            console.log("Vitesse actuelle : " + this.speed) ; 
            this.playButton() ; 
        }
        clear = () => {
            var grid = Array(this.rows).fill().map( () => Array(this.cols).fill(false)) ; 
            this.setState({
                gridFull: grid,
                generation: 0
            });
        }
        gridSize = (size) => {
            switch (size) {
                case "1":
                    this.cols = 20 ;
                    this.rows = 10 ;
                    break;
                case "2":
                    this.cols = 50 ;
                    this.rows = 30 ;
                    break;            
                default:
                        this.cols = 70 ;
                        this.rows = 50 ;
                        break;
            }
            this.clear() ; 
        }
        play = () => {
            let grid = this.state.gridFull ; 
            let grid2 = arrayClone(this.state.gridFull) ; 

            // Game of Life ruleS
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                  let nbNeighbour = 0;
                  if (i > 0) if (grid[i - 1][j]) nbNeighbour++;
                  if (i > 0 && j > 0) if (grid[i - 1][j - 1]) nbNeighbour++;
                  if (i > 0 && j < this.cols - 1) if (grid[i - 1][j + 1]) nbNeighbour++;
                  if (j < this.cols - 1) if (grid[i][j + 1]) nbNeighbour++;
                  if (j > 0) if (grid[i][j - 1]) nbNeighbour++;
                  if (i < this.rows - 1) if (grid[i + 1][j]) nbNeighbour++;
                  if (i < this.rows - 1 && j > 0) if (grid[i + 1][j - 1]) nbNeighbour++;
                  if (i < this.rows - 1 && j < this.cols - 1) if (grid[i + 1][j + 1]) nbNeighbour++;
                  if (grid[i][j] && (nbNeighbour < 2 || nbNeighbour > 3)) grid2[i][j] = false;
                  if (!grid[i][j] && nbNeighbour === 3) grid2[i][j] = true;
                }
              }
              this.setState({
                   gridFull: grid2,
                   generation: this.state.generation+1
              });
        }

        componentDidMount() {
            this.seed() ; 
            this.playButton() ; 
        }
        
        render() {
            return(
                <div>
                <h1>The Game Of Life</h1>
                <Buttons 
                playButton = {this.playButton}
                pauseButton = {this.pauseButton}
                slow = {this.slow}
                fast = {this.fast}
                clear = {this.clear}
                seed = {this.seed}
                gridSize = {this.gridSize}
                />
                <Grid 
                gridFull = {this.state.gridFull}
                rows = {this.rows} 
                cols = {this.cols} 
                selectBox = {this.selectBox}
                />
                <h2> Generations : {this.state.generation} </h2>
                </div>
                );
            }
        }
        
        function arrayClone(arr) { 
            return JSON.parse(JSON.stringify(arr)) ; 
        }

        ReactDOM.render(<Main />, document.getElementById('root'));
