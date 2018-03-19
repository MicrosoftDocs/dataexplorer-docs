define(function (require) {
    var pako = require('pako');

    return {
        compressAndEncodeBase64AndUri: compressAndEncodeBase64AndUri,
        compressAndEncodeBase64: compressAndEncodeBase64,
        compressString: compressString,
        decompressBase64: decompressBase64,
        decompressBase64UriComponent: decompressBase64UriComponent,
        decompressString: decompressString,
    };

    /**
     * Compress a text, encode with base64 encoding, and encode with URL encoding.
     * @param {} str - uncompressed text
     * @returns {} Compressed + base64-encoded + URL-encoded text
     */
    function compressAndEncodeBase64AndUri(str) {
        var compressedBase64 = compressAndEncodeBase64(str);

        // Encode the data with URL-encoding
        return encodeURIComponent(compressedBase64);
    }

    /**
     * Compress a text and encode with base64 encoding.
     * @param {} str - uncompressed text
     * @returns {} Compressed + base64-encoded text
     */
    function compressAndEncodeBase64(str) {
        var compressed = compressString(str);

        // Convert from Base64
        return btoa(compressed);
    }

    /**
     * Compress a text.
     * @param {} str - uncompressed text
     * @returns {} Compressed text
     */
    function compressString(str) {
        // Convert to a byte array
        var byteArray = toUTF8Array(str);

       // Compress the byte array
        var compressedByteArray = pako.gzip(byteArray);

        // Convert from compressed byte array to compressed string
        var compressed = String.fromCharCode.apply(null, compressedByteArray);

        return compressed;
    }

    /**
     * Decompress a text that is (1) URL Encoded, (2) Base-64 encoded, and (3) ZIP compressed.
     * @param {} compressedBase64UriComponent 
     * @returns {} Decompressed text
     */
    function decompressBase64UriComponent(compressedBase64UriComponent) {
        // Decode the data from the URL
        var compressedBase64 = decodeURIComponent(compressedBase64UriComponent);

        return decompressBase64(compressedBase64);
    }

    /**
     * Decompress a text that is (1) Base-64 encoded, and (2) ZIP compressed.
     * @param {} compressedBase64 
     * @returns {} Decompressed text
     */
    function decompressBase64(compressedBase64) {
        // Convert from Base64
        var compressed = atob(compressedBase64);

        return decompressString(compressed);
    }

    /**
     * Decompress a text that is ZIP compressed.
     * @param {} compressed 
     * @returns {} Decompressed text
     */
    function decompressString(compressed) {
        // Convert to a byte array
        var compressedByteArray = compressed.split('').map(function (e) {
            return e.charCodeAt(0);
        });

        // Decompress the byte array
        var decompressedByteArray = pako.inflate(compressedByteArray);

        // Convert from decompressed byte array to string
        var decompressed = fromUTF8Array(decompressedByteArray);

        return decompressed;
    }

    // Based on Unicode specification: https://en.wikipedia.org/wiki/UTF-8#Description
    function toUTF8Array(str) {
        var utf8 = [];
        for (var i=0; i < str.length; i++) {
            var charcode = str.charCodeAt(i);
            if (charcode < 0x80) utf8.push(charcode);
            else if (charcode < 0x800) {
                utf8.push(0xc0 | (charcode >> 6), 
                        0x80 | (charcode & 0x3f));
            }
            else if (charcode < 0xd800 || charcode >= 0xe000) {
                utf8.push(0xe0 | (charcode >> 12), 
                        0x80 | ((charcode>>6) & 0x3f), 
                        0x80 | (charcode & 0x3f));
            }
            // surrogate pair
            else {
                i++;
                // UTF-16 encodes 0x10000-0x10FFFF by
                // subtracting 0x10000 and splitting the
                // 20 bits of 0x0-0xFFFFF into two halves
                charcode = 0x10000 + (((charcode & 0x3ff)<<10)
                        | (str.charCodeAt(i) & 0x3ff));
                utf8.push(0xf0 | (charcode >>18), 
                        0x80 | ((charcode>>12) & 0x3f), 
                        0x80 | ((charcode>>6) & 0x3f), 
                        0x80 | (charcode & 0x3f));
            }
        }
       return utf8;
    }

    // Based on Unicode specification: https://en.wikipedia.org/wiki/UTF-8#Description
    function fromUTF8Array(utf8) {
        var charsArray = [];
        for (var i = 0; i < utf8.length; i++) {
            var charCode, firstByte, secondByte, thirdByte, fourthByte;
            // Byte starts with 0 (e.g. 0xxxxxxx) --> character is 1-byte long
            if ((utf8[i] & 0x80) === 0) {
                charCode = utf8[i];
            }
            // Byte starts with 110 --> character is 2-byte long. 2nd byte starts with 10
            else if ((utf8[i] & 0xE0) === 0xC0) {
                firstByte = utf8[i] & 0x1F;
                secondByte = utf8[++i] & 0x3F;
                charCode = (firstByte << 6) + secondByte;
            }
            // Byte starts with 1110 --> character is 3-byte long. 2nd/3rd bytes start with 10
            else if ((utf8[i] & 0xF0) === 0xE0) {
                firstByte = utf8[i] & 0x0F;
                secondByte = utf8[++i] & 0x3F;
                thirdByte = utf8[++i] & 0x3F;
                charCode = (firstByte << 12) + (secondByte << 6) + thirdByte;
            }
            // Byte starts with 11110 --> character is 4-byte long. 2nd/3rd/4th bytes start with 10
            else if ((utf8[i] & 0xF8) === 0xF0) {
                firstByte = utf8[i] & 0x07;
                secondByte = utf8[++i] & 0x3F;
                thirdByte = utf8[++i] & 0x3F;
                fourthByte = utf8[++i] & 0x3F;
                charCode = (firstByte << 18) + (secondByte << 12) + (thirdByte << 6) + fourthByte;
            }

            charsArray.push(charCode);
        }
        return String.fromCharCode.apply(null, charsArray);
    }

});


