/**
 * String manipulation utility functions
 */

// Reverse a string using modern JS methods
function reverser(str) {
    if (typeof str !== 'string') return '';
    return str.split('').reverse().join('');
}

// Find a string looking forward from startingString until endSign
function afterUntil(data, startString, endSign) {
    if (!data || !startString || !endSign) return '';
    
    const startIndex = data.indexOf(startString);
    if (startIndex === -1) return '';
    
    const searchStart = startIndex + startString.length;
    const endIndex = data.indexOf(endSign, searchStart);
    if (endIndex === -1) return '';
    
    return data.slice(searchStart, endIndex);
}

// Find a string in reverse from endString until endSign
function backWard(data, endString, endSign) {
    if (!data || !endString || !endSign) return '';
    
    const endIndex = data.indexOf(endString);
    if (endIndex === -1) return '';
    
    let result = endString;
    let currentIndex = endIndex - 1;
    
    while (currentIndex >= 0 && data[currentIndex] !== endSign) {
        result += data[currentIndex];
        currentIndex--;
    }
    
    return result;
}

// Get string between two markers
function inBetween(data, start, end) {
    if (!data || !start || !end) return '';
    
    const startIndex = data.indexOf(start);
    if (startIndex === -1) return '';
    
    const searchStart = startIndex + start.length;
    const endIndex = data.indexOf(end, searchStart);
    if (endIndex === -1) return '';
    
    return data.slice(searchStart, endIndex);
}

// Get string between two markers (evolved version)
function inBetweenEvol(data, start, end) {
    if (!data || !start || !end) return '';
    
    const startIndex = data.indexOf(start);
    if (startIndex === -1) return '';
    
    const searchStart = startIndex + start.length;
    const remaining = data.slice(searchStart);
    const endIndex = remaining.indexOf(end);
    if (endIndex === -1) return '';
    
    return remaining.slice(0, endIndex);
}

// Get fixed-length string after a marker
function inBetweenLong(data, start, length) {
    if (!data || !start || typeof length !== 'number' || length < 0) return '';
    
    const startIndex = data.indexOf(start);
    if (startIndex === -1) return '';
    
    const searchStart = startIndex + start.length;
    return data.slice(searchStart, searchStart + length);
}

// Get fixed-length string including the start marker
function startWithLong(data, startWith, length) {
    if (!data || !startWith || typeof length !== 'number' || length < 0) return '';
    
    const startIndex = data.indexOf(startWith);
    if (startIndex === -1) return '';
    
    const searchStart = startIndex + startWith.length;
    return startWith + data.slice(searchStart, searchStart + length);
}

// Get string before a marker (inclusive)
function beforeUntil(data, endSign) {
    if (!data || !endSign) return '';
    
    const lastIndex = data.lastIndexOf(endSign);
    if (lastIndex === -1) return '';
    
    return data.slice(0, lastIndex);
}

module.exports = {
    reverser,
    afterUntil,
    backWard,
    inBetween,
    inBetweenEvol,
    inBetweenLong,
    startWithLong,
    beforeUntil
};
