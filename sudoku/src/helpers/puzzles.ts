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
export const PUZZLE_INDEXES = Array.from(Array(3).keys());

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

/**
 * Loads a puzzle into an ISharedMap.
 *
 * @param index - The index of the puzzle to load.
 * @param puzzleMap - The shared map that stores puzzle data.
 * @returns The solved puzzle as a 2-dimensional array.
 */

export function checkUserInput(input: string, puzzleMap: ISharedMap, solutionMap: ISharedMap){

    if(solutionMap.get(input) != "undefined"){


        window.alert(true);

        /*var start = solutionMap.get(input).split(":")[0];
        var startRow = start.split(",")[1];
        var startCol = start.split(",")[0];

        var end = solutionMap.get(input).split(":")[1]
        var endRow = end.split(",")[1];
        var endCol = end.split(",")[0];
        
        var i,j;

        for (i = startRow; i<=endRow;i++) {
            for (j = startCol; j<=endCol;j++) {
            const key = Coordinate.asString(i, j);
            SudokuCell cell = puzzleMap.get(key);
            var value;
    
            if(solution.found[i].orientation == "vertical"){
                value = Coordinate.asString(solution.found[i].x, solution.found[i].y+solution.found[i].overlap-1);
            }
            else{
                value = Coordinate.asString(solution.found[i].x+solution.found[i].overlap-1, solution.found[i].y); 
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
        }*/

    }

    return false;
}
export function loadPuzzle(index: number, puzzleMap: ISharedMap, solutionMap: ISharedMap): number[][] {
    //const puzzleInput = PUZZLES[index];
    //const solution = sudoku.solve(puzzleInput);

    var words = ['cow'];

            // Start a basic word game without customization !
            const puzzleInput = wordfind.newPuzzle(words, {
                // Set dimensions of the puzzle
                height: 3,
                width:  3,
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
        const key = Coordinate.asString(solution.found[i].x, solution.found[i].y);
        var value;

        if(solution.found[i].orientation == "vertical"){
            value = Coordinate.asString(solution.found[i].x, solution.found[i].y+solution.found[i].overlap-1);
        }
        else{
            value = Coordinate.asString(solution.found[i].x+solution.found[i].overlap-1, solution.found[i].y); 
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