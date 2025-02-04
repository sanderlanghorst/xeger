import { Size, Diversity } from './Enums.js';

export class GenerationContext {

    /**
     * the context that tracks things
     * @param {Size} size the generated size
     * @param {Diversity} diversity the generation diversity
     */
    constructor(size, diversity){
        this._size = size;
        this._diversity = diversity;
    }

    /**
     * @returns {Size}
     */
    get Size(){
        return this._size;
    }

    /**
     * @returns {Diverity}
     */
    get Diversity(){
        return this._diversity;
    }

}