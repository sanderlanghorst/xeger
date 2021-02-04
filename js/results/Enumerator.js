import ResultContext from "./ResultContext.js";

export default class Enumerator {

    /**
     * 
     * @param {ResultContext} resultContext the result context
     * @param {Number} fraction the result context
     */
    constructor(resultContext, fraction) {
        this._context = resultContext;
        this._fraction = fraction;
        this._currentValue = null;
        this._minResults = 0;
        this._maxResults = 0;
        this._index = -1;
        this._position = 0;
    }

    /**
     * @returns {Boolean}
     */
    GetNext() {
        this._index++;

        if (this._maxResults < this._context.NumberOfResults) {
            //max results is limit
            if (this._index * this._fraction >= this._maxResults)
                return false;
            this._position = (this._index * this._fraction) / this._maxResults;
            return true;
        }
        else {
            //context number of results is limit
            if (this._index >= this._context.NumberOfResults)
                return false;

            this._position = (this._index * this._fraction) / this._context.NumberOfResults;
            return true;
        }
    }

    /**
     * @returns {String}
     */
    get CurrentValue() {
        return this._currentValue;
    }

    /**
     * @returns {Number}
     */
    get MaxResults() {
        return this._maxResults;
    }

    /**
     * @returns {Number}
     */
    get MinResults() {
        return this._minResults;
    }

}