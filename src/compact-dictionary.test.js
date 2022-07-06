import compactDictionary from "./compact-dictionary.js";
import dictionary from "./full-dictionary.js";

// Replace value
compactDictionary["(0013,1010)"] = {
    tag: "(0013,1010)",
    vr: "LO",
    name: "TrialName",
    vm: "1",
    version: "Custom"
};

console.log('Set custom value: ', compactDictionary["(0013,1010)"]);

// Read all values
let start = performance.now();
let keys = Object.keys(compactDictionary);
let values = [];
for (let key of keys) {
    values.push(compactDictionary[key].tag);
}
console.log('Using proxy: Read', values.length + ' values in', performance.now() - start, 'ms');

// Read all values
start = performance.now();
keys = Object.keys(dictionary);
values = [];
for (let key of keys) {
    values.push(dictionary[key].tag);
}
console.log('Using POJO: Read', values.length + ' values in', performance.now() - start, 'ms');


// Make sure values are equal for both dictionaries
for (let entryKey of Object.keys(dictionary)) {
    if (entryKey === '') continue;
    const entry = dictionary[entryKey];
    const compactEntry = compactDictionary[entryKey];

    // Check that all keys for standard dictionary entry are present and equal
    // on compact dictionary
    for (let key of Object.keys(entry)) {
        if (entry[key] !== compactEntry[key]) {
            console.error('Standard dictionary:', entry);
            console.error('Compact dictionary:', compactEntry);
            throw new Error('Unmatched entry')
        }
    }

    // Check the other way round
    for (let key of Object.keys(compactEntry)) {
        if (entry[key] !== compactEntry[key]) {
            console.error('Standard dictionary:', entry);
            console.error('Compact dictionary:', compactEntry);
            throw new Error('Unmatched entry')
        }
    }
}

console.log('All key values match')
