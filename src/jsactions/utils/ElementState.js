/** 
 * @license
 * Copyright (c) 2023 Gaurang Lade
 * 
 * MIT License
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


/**
 *
 *
 * ElementState is static class and provies common states of Element as Constants.
 */
class ElementState {


    /**
     *
     *
     * @readonly
     * @static
     * @memberof ElementState
     */
    static get LOADING() {
        return "loading";
    }


    /**
     *
     *
     * @readonly
     * @static
     * @memberof ElementState
     */
    static get LOADED() {
        return "loaded";
    }


    /**
     *
     *
     * @readonly
     * @static
     * @memberof ElementState
     */
    static get SUCCESS() {
        return "success";
    }


    /**
     *
     *
     * @readonly
     * @static
     * @memberof ElementState
     */
    static get ERROR() {
        return "error";
    }


    /**
     *
     *
     * @readonly
     * @static
     * @memberof ElementState
     */
    static get WARNING() {
        return "warning";
    }


    /**
     *
     *
     * @readonly
     * @static
     * @memberof ElementState
     */
    static get READONLY() {
        return "readonly";
    }


    /**
     *
     *
     * @readonly
     * @static
     * @memberof ElementState
     */
    static get ENABLED() {
        return "enabled";
    }


    /**
     *
     *
     * @readonly
     * @static
     * @memberof ElementState
     */
    static get DISABLED() {
        return "disabled";
    }


    /**
     *
     *
     * @readonly
     * @static
     * @memberof ElementState
     */
    static get DEFAULT() {
        return "default";
    }

}

export default ElementState;