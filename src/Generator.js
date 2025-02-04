import { SelectorBase } from "./components/SelectorBase.js";
import {Size, Diversity} from './Enums.js'
import { GenerationContext } from "./GenerationContext.js";

const sizeNumbers = {
    [Size.Small]: 10,
    [Size.Medium]: 50,
    [Size.Large]: 100,
    [Size.Insane]: 1000
}

export class Generator
{
    /**
     * @param {Size} size the size
     * @param {Diversity} diversity the diversity
     */
    constructor(size, diversity) {
        /** @type {Size} */
        this._size = size;
        /** @type {Diversity} */
        this._diversity = diversity;
    }

    /**
     * Generate output
     * @param {SelectorBase} component the component from which to generate
     * @returns {Array<string>}
     */
    Generate(component) {
        const context = new GenerationContext(this._size, this._diversity);
        const requestedSize = sizeNumbers[context.Size];
        //var maxSize = component.GetMaxSize();
        const maxSize = 26;
        const size = Math.max(1, Math.min(requestedSize, maxSize));
        const result = [];
        for(let i = 0; i < size; i++){
            result.push(component.Generate(context));
        }
        const set = new Set(result); //set ensures unique entries
        return Array.from(set).sort();
    }
}