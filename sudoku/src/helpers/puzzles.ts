/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ISharedMap } from "@fluidframework/map";
//import sudoku from "sudokus";
import { Coordinate } from "./coordinate";
import { SudokuCell } from "./sudokuCell";

import {wordfind} from '../../public/wordfind'
//import {wordfindgame} from '../../public/wordfindgame'

//declare var WordFindGame: any;

/**
 * An array of numbers 0-9 for convenient looping when building Sudoku grids.
 */
export const PUZZLE_INDEXES = Array.from(Array(10).keys());

export const PUZZLES = [
    [
        [0, 0, 2, 0, 6, 8, 0, 9, 7],
        [4, 0, 6, 3, 0, 9, 0, 0, 0],
        [0, 0, 0, 2, 0, 0, 0, 3, 5],
        [0, 0, 7, 0, 0, 0, 0, 5, 8],
        [6, 0, 8, 0, 0, 0, 7, 0, 4],
        [5, 2, 0, 0, 0, 0, 9, 0, 0],
        [1, 9, 0, 0, 0, 3, 0, 0, 0],
        [0, 0, 0, 7, 0, 4, 8, 0, 9],
        [8, 7, 0, 1, 9, 0, 3, 0, 0],
    ],
    [
        [0, 0, 0, 2, 9, 0, 1, 0, 0],
        [6, 0, 0, 5, 0, 1, 0, 7, 0],
        [0, 0, 0, 0, 0, 0, 0, 3, 4],
        [0, 0, 0, 0, 0, 0, 9, 4, 0],
        [4, 5, 0, 3, 0, 0, 0, 6, 2],
        [2, 0, 9, 0, 0, 4, 3, 1, 0],
        [0, 2, 0, 0, 0, 0, 4, 9, 0],
        [0, 0, 6, 0, 0, 8, 0, 0, 0],
        [0, 4, 3, 0, 2, 0, 0, 8, 7],
    ],
];

var constColorMap = new Map([
    [1, "green"],
    [2, "red"],
    [3, "yellow"]
]);

export var playerName = "";

export function setPlayerName(input: string, clientColorMap: ISharedMap, counterMap: ISharedMap){

    playerName = input;
    if(clientColorMap.get(playerName) == undefined){

        var count = counterMap.get<number>("current");
        count += 1;
        var color = getColor(count);
        clientColorMap.set(playerName, color);      
        counterMap.set("current", count);        
    }
}

/**
 * Loads a puzzle into an ISharedMap.
 *
 * @param index - The index of the puzzle to load.
 * @param puzzleMap - The shared map that stores puzzle data.
 * @returns The solved puzzle as a 2-dimensional array.
 */

export function checkUserInput(input: string, puzzleMap: ISharedMap, solutionMap: ISharedMap): boolean{

    if(solutionMap.get(input) != undefined){

        return true;
    }
    return false;
}

export function getColor(input: number): string{

    return constColorMap.get(input);
}

export function loadPuzzle(index: number, puzzleMap: ISharedMap, solutionMap: ISharedMap, clientColorMap: ISharedMap, counterMap: ISharedMap): number[][] {
    //const puzzleInput = PUZZLES[index];
    //const solution = sudoku.solve(puzzleInput);

    playerName = window.prompt('Enter your user name')
    setPlayerName(playerName, clientColorMap, counterMap);

    var words = ['cow','rat','horse','dog','tiger', 'lion', 'goat'];

            // Start a basic word game without customization !
            const puzzleInput = wordfind.newPuzzle(words, {
                // Set dimensions of the puzzle
                height: 10,
                width:  10,
                // or enable all with => orientations: wordfind.validOrientations,
                orientations: ['horizontal', 'vertical'],
                // Set a random character the empty spaces
                fillBlanks: true,
                preferOverlap: false
            });

            console.log(puzzleInput);
            var solution = wordfind.solve(puzzleInput, words);
            console.log(solution);


    console.log(solution.found);

    var i:number; 

    for (i = 0; i<solution.found.length;i++) {
        const key = Coordinate.asString(solution.found[i].y, solution.found[i].x);
        var value;

        if(solution.found[i].orientation == "vertical"){
            value = Coordinate.asString(solution.found[i].y+solution.found[i].overlap-1, solution.found[i].x);
        }
        else{
            value = Coordinate.asString(solution.found[i].y, solution.found[i].x+solution.found[i].overlap-1); 
        }
        console.log(key);
        console.log(value);
        solutionMap.set(key+":"+value, true);
        console.log(solutionMap);
    }

    for (const row of PUZZLE_INDEXES) {
        for (const col of PUZZLE_INDEXES) {
            const key = Coordinate.asString(row, col);
            const cell = new SudokuCell(puzzleInput[row][col], key, "open");
            puzzleMap.set(key, cell);
        }
    }
    return solution;
}
