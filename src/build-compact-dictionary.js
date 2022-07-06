/**
 * Approach to making the DICOM dictionary file much smaller:
 * - The object key (hex tag) is duplicated in an object parameter "key"
 *   - Use an object proxy to add a virtual "key" param
 * - The majority of entries have version: "DICOM", vr: "SQ", vm: "1"
 *   - Make the most common parameter value the default, and remove it from the
 *     dictionary. The object proxy can add the default values at runtime.
 * - Many keys and values are verbose
 *   - Replace keys with single letters
 *   - Replace the string values with integer indexes and a lookup table
 *   - Remove unnecessary parentheses from hex tags
 *   - Object proxy replaces all these at runtime.
 */

import fs from "fs";
import dictionary from "./full-dictionary.js";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const compactDictionary = {};

// Lookup tables
const versions = [];
const vrs = [];
const vms = [];

function setDictValue(target, prop, value) {
    const compactEntryKey = prop.replaceAll(/^\(|\)$/gm, ""); // Remove parentheses from key
    const { tag, vr, name, vm, version } = value;

    if (vr && !vrs.includes(vr)) {
        vrs.push(vr);
    }
    if (vm && !vms.includes(vm)) {
        vms.push(vm);
    }
    if (version && !versions.includes(version)) {
        versions.push(version);
    }

    target[compactEntryKey] = {
        r: vr === "SQ" ? undefined : vrs.indexOf(vr), // If undefined, proxy will return "SQ"
        m: vm === "1" ? undefined : vms.indexOf(vm), // If undefined, proxy will return vm: "1"
        v: version === "DICOM" ? undefined : versions.indexOf(version), // If undefined, proxy will return version: "DICOM"
        n: name === "Unknown" ? undefined : name // If undefined, proxy will return "Unknown"
    };
}

for (let entryKey of Object.keys(dictionary)) {
    const entry = dictionary[entryKey];

    if (!entry.tag) continue;

    setDictValue(compactDictionary, entryKey, entry);
}

const exportFile = `
const compactDictionary = ${JSON.stringify(compactDictionary)};
const versions = ${JSON.stringify(versions)};
const vrs = ${JSON.stringify(vrs)};
const vms = ${JSON.stringify(vms)};

${setDictValue.toString()};

const dictionaryProxy = new Proxy(compactDictionary, {
    get(target, prop) {
        const compactEntryKey = prop.replaceAll(/^\\(|\\)$/gm, '');
        if (compactEntryKey in target) {
            let {r: vr, m: vm, v: version, n: name} = target[compactEntryKey];

            vr = vr === undefined ? "SQ" : vrs[vr];
            vm = vm === undefined ? "1" : vms[vm];
            version = version === undefined ? "DICOM" : versions[version];
            name = name === undefined ? "Unknown" : name;

            return {tag: prop, vr, vm, version, name}
        }
        return Reflect.get(...arguments)
    },
    set(target, prop, value) {
        setDictValue(target, prop, value)
        return true;
    },
    ownKeys(target) {
        return Object.keys(target).map(k => '(' + k + ')')
    },
    getOwnPropertyDescriptor(target, prop) { // called for every property
        return {
            enumerable: true,
            configurable: true,
        };
    }
})

export default dictionaryProxy;
`;

fs.writeFileSync(__dirname + "/compact-dictionary.js", exportFile);

export default compactDictionary;
