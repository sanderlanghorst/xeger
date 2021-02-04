
import { Size, Diversity } from '../Enums.js';

const
    sizes = {
        [Size.Small]: 3,
        [Size.Medium]: 10,
        [Size.Large]: 100,
        [Size.Insane]: 1000
    };

export default class ResultContext {
    /**
     * @param {Size} size the size
     * @param {Diversity} diversity the diversity
     */
    constructor(size, diversity) {
        this._size = size;
        this._diversity = diversity;
        this._numberOfResults = sizes[size];
    }

    /**
     * @returns {Diversity} the diversity
     */
    get Diversity() {
        return this._diversity;
    }

    /**
     
     * @returns {Number}
     */
    get NumberOfResults() {
        return this._numberOfResults;
    }


    /**
     * @returns {Size} the size
     */
    get Size() {
        return this._size;
    }
}