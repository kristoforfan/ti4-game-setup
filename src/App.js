// src/App.js

import { Client } from 'boardgame.io/react';
import { Game } from 'boardgame.io/core';
import React from 'react';

//Initial Setup here..


	const TwilightImperium4Setup = Game({
	  name: "Twilight Imperium 4 Game Setup",
	  setup: (ctx) => ({ cells: Array(30).fill(null),
		              availableCells: [1, 2, 3, 4, 5, 6],
		              availableRaces: [],
		              availableHexes: [],
		              
	  }),
	  moves: {
	    clickCell(G, ctx, id) {
	      const cells = [...G.cells];
	      function ValidMove (G, ctx, id) {
	    		// need to check neighbors to make sure there are no Red tiles and this is not a red itle
	    		// need to check that we have at least one valid move
	    		if (ctx.turn >= 0 && ctx.turn < 6){
	    			if (id >= 0 && id < 6){
	    				return true;
	    			}
	    		}
	    		else if (ctx.turn >= 6 && ctx.turn < 18){
	    			if (id >= 6 && id < 18){
	    				return true;
	    			}
	    			
	    		}
	    		else if (ctx.turn >= 18){
	    			if (id >= 18){
	    				return true;
	    			}
	    			
	    		}
	    	}
	      // Ensure we can't overwrite cells.
	      if (ValidMove(G,ctx,id) && cells[id] === null) {
	        cells[id] = ctx.currentPlayer; // should be new tile
	      }
	      else{
	    	  return undefined;
	      }
	      return { ...G, cells };
	    },
	  },

	  flow: {
	    endGameIf: (G, ctx) => {
	      if (G.availableCells.length===0) {
	        return G.availableCells.length;
	      }
	    },
	    turnOrder: {
	    	first: () => 0,
	    	next: (G, ctx) => { 
	    		if (ctx.turn % 6 === 5){ return ctx.playOrderPos } // On the last turn of a round, the last player goes twice.
	    		else if (Math.floor(ctx.turn/6) % 2 === 0){ return ctx.playOrderPos + 1} // forward order on odd rounds
	    		else if (Math.floor(ctx.turn/6) % 2 === 1){ return ctx.playOrderPos - 1} // reverse order on even rounds
	    	}
	    },
	    movesPerTurn: 1
	  }
	});

	class TwilightImperiumBoard extends React.Component {
	  onClickHex(id) {
	    if (this.isActive(id)) {
	      this.props.moves.clickCell(id);
	      this.props.events.endTurn();
	    }
	  }

	  isActive(id) {
	    if (!this.props.isActive) return false;
	    if (this.props.G.cells[id] !== null) return false;
	    return true;
	  }

	  render() {
	    let setupover = '';
	    if (this.props.ctx.gameover !== null) {
	      setupover = <div>Setup is completed! {this.props.ctx.gameover}</div>;
	    }

	    const cellStyle = {
	      border: '1px solid #555',
	      width: '200px',
	      height: '200px',
	      lineHeight: '50px',
	      textAlign: 'center',
	    };

	    let tbody = [];
	    for (let i = 0; i < 5; i++) {
	      let cells = [];
	      for (let j = 0; j < 6; j++) {
	        const id = 6 * i + j;
	        cells.push(
	                <td style={cellStyle} key={id}
	                    className={this.isActive(id) ? 'active' : ''}
	                    onClick={() => this.onClickHex(id)}>
	                  {this.props.G.cells[id]}
	                </td>
	              );
	      }
	      tbody.push(<tr key={i}>{cells}</tr>);
	    }

	    return (
	      <div>
	        <table id="board">
	          <tbody>{tbody}</tbody>
	        </table>
	        {setupover}
	      </div>
	    );
	  }
	}
const App = Client({
  game: TwilightImperium4Setup,
  numPlayers: 6,
  board: TwilightImperiumBoard,
});

export default App;