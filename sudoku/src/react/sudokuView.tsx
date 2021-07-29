/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ISharedMap } from "@fluidframework/map";
import React from "react";
import { Coordinate, CoordinateString } from "../helpers/coordinate";
import { checkUserInput, playerName, PUZZLE_INDEXES } from "../helpers/puzzles";
import { CellState, SudokuCell } from "../helpers/sudokuCell";

/**
 * Props for the SudokuView React component.
 */
export interface ISudokuViewProps {
    puzzle: ISharedMap;
    sol: ISharedMap;
    clientId: string;
    clientPresence?: ISharedMap;
    clientColorMap: ISharedMap;
    counterMap: ISharedMap;
    playerName: String;
    startCoord: String;
    endCoord: String;
    clientScoreMap: ISharedMap;
    setPresence?(cellCoord: CoordinateString, reset: boolean): void;
}

/**
 * Renders a Sudoku grid and UI for resetting/loading puzzles and changing the theme.
 * @param props - Props for the component
 */
export function SudokuView(props: ISudokuViewProps): JSX.Element {
    
    const [theme, setTheme] = React.useState("default");
    //const [playerName, setPlayerName] = React.useState("default");

    /*
    const handleResetButton = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        props.puzzle.forEach((value: SudokuCell, key: CoordinateString) => {
            if (!value.fixed && value.value !== 0) {
                value.value = 0;
                props.puzzle.set(key, value);
            }
            props.puzzle.set(key, value);
        });
    };
    */

    //const [userInput, setUserInput] = React.useState("default");

    // const loadPuzzle1 = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    //     loadPuzzle(0, props.puzzle, props.sol);
    // };

    //let textInput:React.RefObject<HTMLInputElement> = React.createRef();

    /*const checkInput = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        
        if(checkUserInput(userInput, props.puzzle, props.sol)){

            var start = userInput.split(":")[0];
            var startRow = start.split(",")[1];
            var startCol = start.split(",")[0];

            var end = userInput.split(":")[1]
            var endRow = end.split(",")[1];
            var endCol = end.split(",")[0];
            alert(playerName);
            var i,j;
            var color;
            console.log(props.clientId);
            if(props.clientColorMap.get(playerName) == undefined){
                const count = props.counterMap.get<number>("current")+1;
                color = getColor(count);
                props.clientColorMap.set(playerName, color);      
                props.counterMap.set("current", count);        
            }
            else{
                color = props.clientColorMap.get(playerName);
            }

            for (i = startRow; i<=endRow;i++) {
                for (j = startCol; j<=endCol;j++) {
                    const key = Coordinate.asString(i, j);          
                    const toSet = props.puzzle.get<SudokuCell>(key);
                    toSet.color = color;
                    props.puzzle.set(key, toSet);
                }
            }
        }
    };*/

    // const loadPuzzle2 = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    //     loadPuzzle(1, props.puzzle, props.sol);
    // };

    return (
        <div className={`sudoku ${theme}`} style={{minHeight: "100%", marginLeft: "38%"}}>
            <div className={`${props.clientColorMap.get(playerName)}`}>
                    <label><b>{playerName==""?"No players at this moment":{playerName}+" is playing!"}</b></label> 
                    </div>
                    <br/>
                    <label htmlFor="score"><b>Score: </b></label>   
                    <label id="score"><b>{props.clientScoreMap.get(playerName) == undefined?0:props.clientScoreMap.get(playerName)}</b></label> 
                    <br/>
                    {/* <span className="sudoku-load">
                        Load:
                        <button onClick={loadPuzzle1}>Puzzle 1</button>
                        <button onClick={loadPuzzle2}>Puzzle 2</button>
                    </span> */}
            <br/>
            {
                <div className="sudoku-wrapper">
                <SimpleTable {...props} />
                
            </div>
            }
            <span className="sudoku-theme-select">
                        <label htmlFor="theme-select">Theme: </label>
                        <select
                            value={theme}
                            onChange={onThemeChange}
                            id="theme-select"
                            name="theme">
                            <option aria-selected={theme === "default"} value="default">
                                Default Theme{" "}
                            </option>
                            <option aria-selected={theme === "dark-theme"} value="dark-theme">
                                Dark Theme
                            </option>
                        </select>
                    </span>            
        </div>
    );

    function onThemeChange(e: any) {
        setTheme(e.target.value);
    }

    /*function onInputChange(e:any){
        console.log(e.target.value);
        setUserInput(e.target.value);
    }*/
}

function SimpleTable(props: ISudokuViewProps) {
    
    const coordinateDataAttributeName = "cellcoordinate";

    const [startCoord,setStartCoordinate] = React.useState("default");
    //const [endCoord,setEndCoordinate] = React.useState("default");

    const getCellInputElement = (coord: CoordinateString): HTMLInputElement =>
        document.getElementById(`${props.clientId}-${coord}`) as HTMLInputElement;

    const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        const coord = e.target.dataset[coordinateDataAttributeName];
        if (props.setPresence) {
            if (coord !== undefined) {
                props.setPresence(coord, false);
            }
        }
    };

    const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {

        const coord = e.target.dataset[coordinateDataAttributeName];
        if (props.setPresence) {
            if (coord !== undefined) {
                props.setPresence(coord, true);
            }
        }
    };

    /*const handleMouseDownEvent = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {

        //const coord = e.target.dataset[coordinateDataAttributeName];
        if (e.type === "mouseup") {
           // window.alert("mouseup"+e.currentTarget.dataset[coordinateDataAttributeName]);
        } else {
            console.log("mousedown")
        }
    };*/

    const handleDragStart = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        //window.log("Rohan");
        let coord = e.currentTarget.dataset[coordinateDataAttributeName] as string;
        console.log(coord);
        setStartCoordinate(coord);
    };

    const handleDragEnd = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {

        let coord = e.currentTarget.dataset[coordinateDataAttributeName] as string;
        console.log(coord);
        //setEndCoordinate(coord);
        console.log(startCoord+" + "+" "+coord);
        const userInput= startCoord+":"+coord;
        if(checkUserInput(userInput, props.puzzle, props.sol)){

            var start = userInput.split(":")[0];
            var startRow = start.split(",")[0];
            var startCol = start.split(",")[1];

            var end = userInput.split(":")[1]
            var endRow = end.split(",")[0];
            var endCol = end.split(",")[1];
        
            var i,j;
            var color;
            color = props.clientColorMap.get(playerName);

            if(props.clientScoreMap.get(playerName) == undefined){

                props.clientScoreMap.set(playerName, 1);       
            }
            else{
                var count = props.clientScoreMap.get(playerName);
                props.clientScoreMap.set(playerName, count+1);   
            }

            for (i = startRow; i<=endRow;i++) {
                for (j = startCol; j<=endCol;j++) {
                    const key = Coordinate.asString(i, j);          
                    const toSet = props.puzzle.get<SudokuCell>(key);
                    toSet.color = color;
                    props.puzzle.set(key, toSet);
                }
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        let keyString = e.key;
        let coord = e.currentTarget.dataset[coordinateDataAttributeName] as string;
        coord = coord === undefined ? "" : coord;
        //const cell = props.puzzle.get<SudokuCell>(coord);

        switch (keyString) {
            case "Backspace":
            case "Delete":
            case "Del":
            case "0":
                keyString = "0";
            // Intentional fall-through
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
                /*if (cell.fixed) {
                    return;
                }*/
                window.alert("keyDown");
                numericInput(keyString, coord);
                return;
            default:
                moveCell(keyString, coord);
                return;
        }
    };

    const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        let keyString = e.key;
        let coord = e.currentTarget.dataset[coordinateDataAttributeName] as string;
        coord = coord === undefined ? "" : coord;
        //const cell = props.puzzle.get<SudokuCell>(coord);

        switch (keyString) {
            case "Backspace":
            case "Delete":
            case "Del":
            case "0":
                keyString = "0";
            // Intentional fall-through
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
                /*if (cell.fixed) {
                    return;
                }*/
                window.alert("keyUp");
                numericInput(keyString, coord);
                return;
            default:
                moveCell(keyString, coord);
                return;
        }
    };
    
    const numericInput = (keyString: string, coord: string) => {
        
        if (coord !== undefined) {
            const cellInputElement = getCellInputElement(coord);
            cellInputElement.value = keyString;

            const toSet = props.puzzle.get<SudokuCell>(coord);
            /*if (toSet.fixed) {
                return;
            }*/
            //toSet.value = valueToSet;
            //toSet.isCorrect = valueToSet === toSet.correctValue;
            props.puzzle.set(coord, toSet);
        }
    };

    const moveCell = (keyString: string, coordIn: string) => {
        const coord = coordIn;
        let newCoord = coordIn;
        switch (keyString) {
            case "ArrowDown":
            case "s":
                newCoord = Coordinate.moveDown(coord);
                break;
            case "ArrowUp":
            case "w":
                newCoord = Coordinate.moveUp(coord);
                break;
            case "ArrowLeft":
            case "a":
                newCoord = Coordinate.moveLeft(coord);
                break;
            case "ArrowRight":
            case "d":
                newCoord = Coordinate.moveRight(coord);
                break;
            default:
                newCoord = coord;
        }

        const newCell = getCellInputElement(newCoord);
        newCell.focus();
    };

    const renderGridRows = () => {
        const rows = PUZZLE_INDEXES.map((row) => {
            const columns = PUZZLE_INDEXES.map((col) => {
                const coord = Coordinate.asString(row, col);
                const currentCell = props.puzzle.get<SudokuCell>(coord);
                const state = SudokuCell.getState(currentCell);
                let inputClasses: string;
                switch (state) {
                    case CellState.correct:
                        inputClasses = `sudoku-input green`;
                        break;
                    case CellState.wrong:
                        inputClasses = `sudoku-input red`;
                        break;
                    case CellState.yellow:
                        inputClasses = `sudoku-input yellow`;
                        break;
                    default:
                        inputClasses = `sudoku-input`;
                }

                if (props.clientPresence) {
                    const cellOwner = props.clientPresence.get<string>(coord);
                    if (cellOwner && cellOwner !== props.clientId) {
                        inputClasses += " presence";
                    }
                }
                // Const disabled = currentCell.fixed === true;
                return (
                    <td className="sudoku-cell" key={coord} style={getCellBorderStyles(coord)}>
                        <input
                            id={`${props.clientId}-${coord}`}
                            className={inputClasses}
                            type="text"
                            readOnly={true}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                            onKeyDown={handleKeyDown}
                            onKeyUp={handleKeyUp}
                            //onMouseDown={handleMouseDownEvent}
                            onMouseDown={handleDragStart} 
                            onMouseUp={handleDragEnd}
                            value={SudokuCell.getDisplayString(currentCell)}
                            max={1}
                            // Disabled={disabled}
                            data-cellcoordinate={coord}
                        />
                    </td>
                );
            });
            return <tr key={row.toString()}>{columns}</tr>;
        });
        return rows;
    };

    return (
        <table style={{ border: "none" }}>
            <tbody>{renderGridRows()}</tbody>
        </table>
    );
}

/**
 * Returns CSS border properties to use when rendering a cell. This helps give the grid that authentic Sudoku look.
 */
function getCellBorderStyles(coord: CoordinateString): React.CSSProperties {
    const borderStyle = "solid medium";
    const styles: React.CSSProperties = {
        borderTop: "none",
        borderBottom: "none",
        borderLeft: "none",
        borderRight: "none",
        borderColor: "var(--neutralPrimaryAlt)",
    };
    const [row, col] = Coordinate.asArrayNumbers(coord);

    switch (row) {
        case 0:
            styles.borderTop = borderStyle;
            styles.paddingTop = 4;
            break;
        /*case 3:
        case 6:
        case 2:
        case 5:*/
        case 9:
            styles.borderBottom = borderStyle;
            styles.paddingBottom = 4;
            break;
        default: // Nothing
    }

    switch (col) {
        case 0:
            styles.borderLeft = borderStyle;
            styles.paddingLeft = 4;
            break;
        /*case 3:

        case 6:
        case 2:
        case 5:*/
        case 9:
            styles.borderRight = borderStyle;
            styles.paddingRight = 4;
            break;
        default: // Nothing
    }
    return styles;
}
