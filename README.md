# Compact DICOM Directory

Generate a more compact dicom directory object using ES Object Proxy. This
allows us to virtualize the most often repeated values in the directory to save
space, in exchange for a slight performance reduction.

See [src/build-compact-dictionary.js](src/build-compact-dictionary.js) for more information.

The full dictionary object is copied from the dcmjs repository: https://github.com/dcmjs-org/dcmjs/blob/master/src/dictionary.js

- Full dictionary with POJO (minified): 844 KB
- Compact dictionary with Object Proxy (minified): 400 KB