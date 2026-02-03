// TODO: might want to refactor downloadFile and downloadROM so it only gets field data once
// -TODO-: Prompt user to name download file?

var mouseDown = false;
var blackFlag = false;
var lastElement = null;
var LOGO_HEX = "CEED6666CC0D000B03730083000C000D0008111F8889000EDCCC6EE6DDDDD999BBBB67636E0EECCCDDDC999FBBB9333E";
var GBA_LOGO_HEX = "24FFAE51699AA2213D84820A84E409AD11248B98C0817F21A352BE199309CE2010464A4AF82731EC58C7E83382E3CEBF85F4DF94CE4B09C194568AC01372A7FC9F844D73A3CA9A615897A327FC039876231DC7610304AE56BF38840040A70EFDFF52FE036F9530F197FBC08560D68025A963BE03014E38E2F9A234FFBB3E0344780090CB88113A9465C07C6387F03CAFD625E48B380AAC7221D4F807";
var uploadedHexData = "C38B020000000000C38B02FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF87E15F1600195E2356D5E1E9FFFFFFFFFFFFFFFFFFFFFFFFC3FD01FFFFFFFFFFC31227FFFFFFFFFFC31227FFFFFFFFFFC37E01FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF00C35001CEED6666CC0D000B03730083000C000D0008111F8889000EDCCC6EE6DDDDD999BBBB67636E0EECCCDDDC999FBBB9333E";
for (var i = 0; i < 32460; i++) {
    uploadedHexData += "FF";
}

var currentMode = "gb";

// When the user left clicks, set mouseDown flag
document.onmousedown = function() {
    mouseDown = true;
};

// When the user releases the left button, set mouseDown flag
document.onmouseup = function() {
    mouseDown = false;
};

function initialize() {
    setTableDimensions();
    loadLogo(LOGO_HEX);
    changeMode();
}

function changeMode() {
    var mode = document.getElementById('consoleModeSelect').value;
    currentMode = mode;
    if (mode === 'gba') {
        $('.gb-only').hide();
        $('#titleLabel').text('Game Title (12 chars)');
        $('#titleInput').attr('placeholder', '12 ASCII characters').attr('maxlength', '12');
        $('#manufacturerLabel').text('Game Code');
        $('#manufacturerInput').attr('placeholder', '4 ASCII chars').attr('maxlength', '4');
        $('#licenseeLabel').text('Maker Code');
        $('#newLicenseeInput').attr('placeholder', '2 ASCII chars').attr('maxlength', '2');
        
        // Enable logo grid for GBA (warning: saving custom GBA logos not yet implemented)
        $('#dynamicHeight').css('opacity', '1').css('pointer-events', 'auto');
        clearLogo(); // Clear it initially as we don't load the GBA logo into the grid yet
        
    } else {
        $('.gb-only').show();
        $('#titleLabel').text('Title');
        $('#titleInput').attr('placeholder', '11 ASCII characters').attr('maxlength', '11');
        $('#manufacturerLabel').text('Manufacturer');
        $('#manufacturerInput').attr('placeholder', '4 character manufacturer code').attr('maxlength', '4');
        $('#licenseeLabel').text('New Licensee Code');
        $('#newLicenseeInput').attr('placeholder', '2 character ASCII code').attr('maxlength', '2');
        
        $('#dynamicHeight').css('opacity', '1').css('pointer-events', 'auto');
        if (convertLogoToHex().replace(/0/g, '') === "") { // If empty, load default?
            loadLogo(LOGO_HEX);
        }
    }
}

function setTableDimensions() {
    var div = $('#dynamicHeight');
    var width = (div.width() * .1651376146789);
    div.css('height', width);
}

// When the user hovers the mouse over something and the mouse is down,
// color it
function mouseOverHandler(element) {
    if (mouseDown) {
        if (blackFlag) {
            element.style.backgroundColor = "black";
        } else {
            element.style.backgroundColor = "white";
        }
    }
}

// When the mouse is pressed over an element...
function mouseDownHandler(element) {
    fill(element);
    setBlackFlag(element);
}

// When the black flag is set over an element...
function setBlackFlag(element) {
    if (element.style.backgroundColor == "black") {
        blackFlag = true;
    } else {
        blackFlag = false;
    }
}

// Fill the element
function fill(element) {
    if (element.style.backgroundColor == "black") {
        element.style.backgroundColor = "white";
    } else {
        element.style.backgroundColor = "black";
    }
}

// Changes the color of all cells
function invertLogo() {
    var list = document.getElementsByTagName("TD");
    for (var i = 0; i < list.length; i++) {
        fill(list[i]);
    }
}

// Gets the state of the logo, and coverts it to a hex string
function convertLogoToHex() {
    var list = document.getElementsByTagName("TD");
    var hexString = "";
    var toptop = 0;
    var topbottom = 0;
    var bottomtop = 0;
    var bottombottom = 0;
    // there are 48 blocks total
    for (var block = 0; block < 24; block++) {
        toptop = 0;
        topbottom = 0;
        bottomtop = 0;
        bottombottom = 0;
        // each block has 4 columns
        for (var column = 0; column < 4; column++) {
            // block % 12 gives us which column of blocks we are in
            // Math.floor(block / 12) gives us which row of blocks we are in
            // if we are in the column n + 1 then we want to start 4 cells passed column n
            // if we are in row n + 1 then we want to start 96 cells passed row n
            // first add top number of top block
            bgColor = list[((block % 12) * 4) + (Math.floor(block / 12) * 192) + column].style.backgroundColor;
            if (bgColor == "black") {
                // Math.pow(2, 3 - column) will give us 2^3 for the first column, and so on
                toptop += Math.pow(2, 3 - column);
            }
            // then bottom number of top block
            bgColor = list[((block % 12) * 4) + (Math.floor(block / 12) * 192) + column + 48].style.backgroundColor;
            if (bgColor == "black") {
                topbottom += Math.pow(2, 3 - column);
            }
            // then top number of bottom block
            bgColor = list[((block % 12) * 4) + (Math.floor(block / 12) * 192) + column + 96].style.backgroundColor;
            if (bgColor == "black") {
                bottomtop += Math.pow(2, 3 - column);
            }
            // then bottom number of bottom block
            bgColor = list[((block % 12) * 4) + (Math.floor(block / 12) * 192) + column + 144].style.backgroundColor;
            if (bgColor == "black") {
                bottombottom += Math.pow(2, 3 - column);
            }
        }
        // the bottom is added to the string first, then the top
        hexString += toptop.toString(16).toUpperCase();
        hexString += topbottom.toString(16).toUpperCase();
        hexString += bottomtop.toString(16).toUpperCase();
        hexString += bottombottom.toString(16).toUpperCase();
    }
    return hexString;
}

// Creates a downloadable file based on a hex string
function downloadFile() {
    // First check field values to make sure they are okay
    var fieldData = getFieldValues();
    if (fieldData === null) {
        return;
    }
    var downloadOverride = false; // if the logo data isn't okay, stops the download
    
    // Check the logo for GB
    if (currentMode === 'gb' && convertLogoToHex() !== LOGO_HEX) {
        downloadOverride = true;
        $('#confirmationModal').modal();
    } 
    // Check for GBA custom logo (if grid is not empty)
    else if (currentMode === 'gba') {
        // Simple check: is the logo grid not empty?
        // Note: convertLogoToHex returns 0s for empty cells, so "00...00" if empty.
        // Actually convertLogoToHex returns a string. If it's all 0s, it's empty.
        var currentHex = convertLogoToHex();
        // Remove 0s to see if anything is left.
        if (currentHex.replace(/0/g, '').length > 0) {
            downloadOverride = true;
            $('#gbaWarningModal').modal();
        }
    }

    if (!downloadOverride) {
        downloadROM(fieldData);
    }
}

function downloadROM(fieldData) {
    var hexData = ""; // this is binary representation of file
    if (!fieldData) {
        fieldData = getFieldValues();
        if (fieldData === null) return;
    }

    if (currentMode === 'gba') {
        // GBA Header Generation
        var startVector = "2E0000EA";
        var logo = GBA_LOGO_HEX;
        var checksum = calculateGBAHeaderChecksum(fieldData);
        var header = startVector + logo + fieldData + checksum + "0000"; // + 2 reserved bytes

        // Use uploaded data if it looks like a user file (not default GB dummy)
        // Default GB dummy starts with C38B02
        if (uploadedHexData.length > 384 && uploadedHexData.substr(0, 6) !== "C38B02") {
             hexData = header + uploadedHexData.substr(header.length);
        } else {
             hexData = header;
             // Pad to 32KB
             for (var i = hexData.length; i < 65536; i++) {
                 hexData += "FF";
             }
        }
    } else {
        // GB Logic
        // if there was hex data uploaded, inject the modifications into that
        if (uploadedHexData.length > 0) {
            // pre-header stuff
            hexData = uploadedHexData.substr(0, 520);
            hexData += convertLogoToHex();
            hexData += fieldData;
            // calculate header checksums
            hexData += calculateHeaderChecksum(fieldData);
            // calculate global checksums
            hexData += calculateGlobalChecksum(hexData + uploadedHexData.substr(668, uploadedHexData.length));
            // post-header stuff
            hexData += uploadedHexData.substr(672, uploadedHexData.length);
        } else { // otherwise, just create some garbage data

            hexData = "C38B020000000000C38B02FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF87E15F1600195E2356D5E1E9FFFFFFFFFFFFFFFFFFFFFFFFC3FD01FFFFFFFFFFC31227FFFFFFFFFFC31227FFFFFFFFFFC37E01FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF00C35001";
            hexData += convertLogoToHex();
            hexData += fieldData;
            hexData += calculateHeaderChecksum(fieldData);
            // fill up the rest of the 32kb rom with 0xFF
            for (var i = 0; i < 32432; i++) {
                hexData += "FF";
            }
        }
    }

    var byteArray = new Uint8Array(hexData.length / 2);
    for (var x = 0; x < byteArray.length; x++) {
        byteArray[x] = parseInt(hexData.substr(x * 2, 2), 16);
    }

    var data = new Blob([byteArray], {
        type: "application/octet-stream"
    });

    textFile = window.URL.createObjectURL(data);

    // create the download link, then download it, then destroy it
    var a = document.createElement("a");
    var clickEvent = new MouseEvent("click", {
        "view": window,
        "bubbles": true,
        "cancelable": false
    });
    a.style = "display: none";
    a.href = textFile;
    // check the cgb box to see if the rom should have .gb or .gbc extension
    var name = document.getElementById('titleInput').value;
    // make sure there is a name
    if (name === "") {
        name = "logo";
    }
    
    if (currentMode === 'gba') {
        a.download = name + ".gba";
    } else {
        if (document.getElementById('cgbSupportSelect').value == "00") {
            a.download = name + ".gb";
        } else {
            a.download = name + ".gbc";
        }
    }
    a.dispatchEvent(clickEvent);
    setTimeout(function() {
        // document.body.removeChild(a);
        window.URL.revokeObjectURL(textFile);
    }, 100);
}

// precondition: string is the hex representation of bytes of data
// with NO spaces
// Calculates the checksum for the header data
function calculateHeaderChecksum(hexString) {
    var totalChecksum = "";
    var firstChecksum = 0;
    var secondChecksum = 0;
    var first = 0;
    var second = 0;
    var carry = 0;
    for (x = 0; x < hexString.length; x += 2) {
        // reset carry bit
        carry = 0;
        // get the hex values for a byte
        var first = parseInt("0x" + hexString[x]);
        var second = parseInt("0x" + hexString[x + 1]);
        // invert them
        first = invert(first);
        second = invert(second);
        // sum the least significant 4 bits
        secondChecksum += second;
        // if this result is greater than 15, then we have a carry bit
        if (secondChecksum > 15) {
            secondChecksum -= 16;
            carry = 1;
        }
        firstChecksum += first + carry;
        // if this result is greater than 15, then we have a carry bit
        // but we don't care about it
        if (firstChecksum > 15) {
            firstChecksum -= 16;
        }
    }
    // at the very end, convert the checksum ints to chars and put them
    // together. NOTE: checksum should always be a single byte
    totalChecksum += firstChecksum.toString(16).toUpperCase();
    totalChecksum += secondChecksum.toString(16).toUpperCase();
    return totalChecksum;
}

// Performs a bitwise not operation on a decimal integer
function invert(x) {
    return 15 - x;
}

// Calculates the global checksum based on a hex string
// The header checksum is included in this
function calculateGlobalChecksum(string) {
    var totalChecksum = "";
    var firstChecksum = 0;
    var secondChecksum = 0;
    var thirdChecksum = 0;
    var fourthChecksum = 0;
    var first = 0;
    var second = 0;
    var carry = 0;

    for (x = 0; x < string.length; x += 2) {
        // if (x != 1002 && x != 1005){
        if (x != 668 && x != 670) {
            first = parseInt("0x" + string[x + 1]);
            second = parseInt("0x" + string[x]);
            firstChecksum += first;
            if (firstChecksum > 15) {
                firstChecksum -= 16;
                carry = 1;
            } else {
                carry = 0;
            }
            secondChecksum += second + carry;
            if (secondChecksum > 15) {
                secondChecksum -= 16;
                carry = 1;
            } else {
                carry = 0;
            }
            thirdChecksum += carry;
            if (thirdChecksum > 15) {
                thirdChecksum -= 16;
                carry = 1;
            } else {
                carry = 0;
            }
            fourthChecksum += carry;
            if (fourthChecksum > 15) {
                fourthChecksum -= 16;
            }
        }
    }
    totalChecksum += fourthChecksum.toString(16).toUpperCase();
    totalChecksum += thirdChecksum.toString(16).toUpperCase();
    totalChecksum += secondChecksum.toString(16).toUpperCase();
    totalChecksum += firstChecksum.toString(16).toUpperCase();

    return totalChecksum;
}

// Loads a hex representation of a logo into the editor
function loadLogo(hexData) {
    var row = new Array(4);
    var list = document.getElementsByTagName("TD");
    if (!hexData) {
        hexData = prompt("Please enter the hex data. Whitespace is ignored.", LOGO_HEX);

    }
    // first make sure hexData is the properlength and eliminate whitespace in the string
    if (!hexData.isValidHexString()) {
        alert("The hex data contained invalid characters!");
        return;
    }
    if (hexData.length == 96) {
        clearLogo();
        // first do top half of logo
        for (x = 0; x < 48; x += 4) {
            // convert 2 bytes of data
            row[0] = parseInt("0x" + hexData[x]);
            row[1] = parseInt("0x" + hexData[x + 1]);
            row[2] = parseInt("0x" + hexData[x + 2]);
            row[3] = parseInt("0x" + hexData[x + 3]);
            for (y = 0; y < 4; y++) {
                // set first bit
                if (Math.floor(row[y] / 8) == 1) {
                    list[x + (y * 48)].style.backgroundColor = "black";
                    row[y] -= 8;
                }
                // then second bit
                if (Math.floor(row[y] / 4) == 1) {
                    list[(x + 1) + (y * 48)].style.backgroundColor = "black";
                    row[y] -= 4;
                }
                // then third bit
                if (Math.floor(row[y] / 2) == 1) {
                    list[(x + 2) + (y * 48)].style.backgroundColor = "black";
                    row[y] -= 2;
                }
                // then fourth bit
                if (Math.floor(row[y] / 1) == 1) {
                    list[(x + 3) + (y * 48)].style.backgroundColor = "black";
                }
            }
        }
        // then do bottom half
        for (x = 48; x < 96; x += 4) {
            // convert 2 bytes of data
            row[0] = parseInt("0x" + hexData[x]);
            row[1] = parseInt("0x" + hexData[x + 1]);
            row[2] = parseInt("0x" + hexData[x + 2]);
            row[3] = parseInt("0x" + hexData[x + 3]);
            for (y = 0; y < 4; y++) {
                // set first bit
                if (Math.floor(row[y] / 8) == 1) {
                    list[144 + x + (y * 48)].style.backgroundColor = "black";
                    row[y] -= 8;
                }
                // then second bit
                if (Math.floor(row[y] / 4) == 1) {
                    list[145 + x + (y * 48)].style.backgroundColor = "black";
                    row[y] -= 4;
                }
                // then third bit
                if (Math.floor(row[y] / 2) == 1) {
                    list[146 + x + (y * 48)].style.backgroundColor = "black";
                    row[y] -= 2;
                }
                // then fourth bit
                if (Math.floor(row[y] / 1) == 1) {
                    list[147 + x + (y * 48)].style.backgroundColor = "black";
                }
            }
        }
    } else {
        // CONVERT TO MODAL
        alert("The hex data received was not the correct length!");
    }
}

// Resets the logo to the default "Nintendo"
function resetLogo() {
    if (currentMode === 'gb') {
        loadLogo(LOGO_HEX);
    }
}

// Blanks the logo
function clearLogo() {
    var list = document.getElementsByTagName("TD");
    for (x = 0; x < list.length; x++) {
        list[x].style.backgroundColor = "white";
    }
}

// Clears the logo and everything else
function clearEverything() {
    clearLogo();
    document.getElementById('titleInput').value = "";
    document.getElementById('manufacturerInput').value = "";
    document.getElementById('cgbSupportSelect').value = "";
    document.getElementById('newLicenseeInput').value = "";
    document.getElementById('sgbSelect').checked = false;
    document.getElementById('cartridgeTypeSelect').value = "";
    document.getElementById('romSizeSelect').value = "";
    document.getElementById('ramSizeSelect').value = "";
    document.getElementById('destinationSelect').checked = false;
    document.getElementById('oldLicenseeInput').value = "";
    document.getElementById('versionNumberInput').value = "";
}

// jQuery functions that are used for file uploading
$(function() {

    // We can attach the `fileselect` event to all file inputs on the page
    $(document).on('change', ':file', function() {
        var input = $(this); //,
        input.trigger('fileselect');
        input.val("");
    });

    // You have to use callbacks, otherwise you will try to read a result that isn't ready
    $(document).ready(function() {
        $(':file').on('fileselect', function(e) {
            readFile(this.files[0], function(e) {
                //manipulate with result...
                uploadedHexData = e.target.result.hexEncode();
                parseUploadedHexString(uploadedHexData);
            });

        });
    });

    function readFile(file, callback) {
        var reader = new FileReader();
        reader.onload = callback
            // make sure user didn't hit cancel
        if (file != null) {
            reader.readAsBinaryString(file);
        }
    }
});

// From the uploaded rom file, update the UI
function parseUploadedHexString(hexString) {
    // first clear everything
    clearEverything();

    // Detect GBA or GB
    var gbaLogoStart = "24FFAE";
    // GB Logo Start at 0x104 (520 in hex string) is CEED66
    
    if (hexString.substr(8, 6) === gbaLogoStart) {
        // GBA ROM Detected
        document.getElementById('consoleModeSelect').value = 'gba';
        changeMode();
        
        // Parse GBA fields
        var title = hexString.substr(320, 24); // 0xA0
        var gameCode = hexString.substr(344, 8); // 0xAC
        var makerCode = hexString.substr(352, 4); // 0xB0
        var version = hexString.substr(376, 2); // 0xBC
        
        document.getElementById('titleInput').value = title.getASCIIFromHex();
        document.getElementById('manufacturerInput').value = gameCode.getASCIIFromHex();
        document.getElementById('newLicenseeInput').value = makerCode.getASCIIFromHex();
        document.getElementById('versionNumberInput').value = version;

    } else {
        // Assume GB/GBC
        document.getElementById('consoleModeSelect').value = 'gb';
        changeMode();
        
        // then set variables
        nintendoLogo = hexString.substr(520, 96);
        title = hexString.substr(616, 22);
        manufacturerCode = hexString.substr(638, 8);
        cgbFlag = hexString.substr(646, 2);
        newLicenseeCode = hexString.substr(648, 4);
        sgbFlag = hexString.substr(652, 2);
        cartridgeType = hexString.substr(654, 2);
        romSize = hexString.substr(656, 2);
        ramSize = hexString.substr(658, 2);
        destinationCode = hexString.substr(660, 2);
        oldLicenseeCode = hexString.substr(662, 2);
        romVersionNumber = hexString.substr(664, 2);

        // then update the UI
        loadLogo(nintendoLogo);
        document.getElementById('titleInput').value = title.getASCIIFromHex();
        document.getElementById('manufacturerInput').value = manufacturerCode.getASCIIFromHex();
        //setManufacturerCode(manufacturerCode);
        //document.getElementById('manufacturerInput').value = manufacturerCode.getASCIIFromHex();
        setCGBFlag(cgbFlag);
        setNewLicenseeCode(newLicenseeCode);
        //document.getElementById('newLicenseeInput').value = newLicenseeCode.getASCIIFromHex();
        setSGBFlag(sgbFlag);
        setCartridgeType(cartridgeType);
        setRomSize(romSize);
        setRamSize(ramSize);
        setDestinationCode(destinationCode);
        document.getElementById('oldLicenseeInput').value = oldLicenseeCode;
        document.getElementById('versionNumberInput').value = romVersionNumber;
    }
}

// Gets the title hex based on title input
function getTitle() {
    text = document.getElementById('titleInput').value;
    var maxLength = currentMode === 'gba' ? 12 : 11;
    // Do checks
    if (text.length > 0 && text.isValidASCII()) {
        // First convert to hex string
        var returnString = text.toHexString();
        // And then if length is less than max, fill in remaining hex characters with 0's
        for (i = returnString.length; i < maxLength * 2; i++) {
            returnString += "0";
        }
        return returnString;
    } else if (text.length == 0) {
        var str = "";
        for(var i=0; i<maxLength*2; i++) str += "0";
        return str;
    } else {
        return null;
    }
}

// Sets the manufacturer text area based on hex data
function setManufacturerCode(manufacturerCode) {
    var text = document.getElementById('manufacturerInput');
    if (manufacturerCode === "00000000") {
        text.value = "NULL";
    } else {
        text.value = manufacturerCode.getASCIIFromHex();
    }
}

// Gets the manufacturer ID hex based on the manufacturer input
function getManufacturerCode() {
    text = document.getElementById('manufacturerInput').value;
    // Do checks
    if (text.length == 4 && text.isValidASCII()) {
        return text.toHexString();
    } else if (text.length == 0) {
        return "00000000";
    } else {
        return null;
    }
}

// Sets the cgb select box based on hex data
function setCGBFlag(cgbFlag) {
    var select = document.getElementById('cgbSupportSelect');
    select.value = cgbFlag;
}

// Gets the cgb select box hex data based on its value
function getCGBFlag() {
    var select = document.getElementById('cgbSupportSelect');
    return select.value;
}

// Gets the new lisencee code based on hex data
function setNewLicenseeCode(code) {
    var text = document.getElementById('newLicenseeInput');
    if (code === "0000") {
        text.value = "NA";
    } else {
        text.value = code.getASCIIFromHex();
    }
}

// Gets the new licensee hex data based on new licnesee input
function getNewLicenseeCode() {
    text = document.getElementById('newLicenseeInput').value;
    // Do checks
    if (text.length == 2 && text.isValidASCII()) {
        return text.toHexString();
    } else if (text.length == 0) {
        return "0000"
    } else {
        return null;
    }
}

// Sets the sgb checkbox based on hex data
function setSGBFlag(sgbFlag) {
    var select = document.getElementById('sgbSelect');
    select.value = sgbFlag;
}

// Gets the sgb hex based on checkbox
function getSGBFlag() {
    var select = document.getElementById('sgbSelect');
    return select.value;
}

// Sets the cartridge type based on hex data
function setCartridgeType(cartridgeType) {
    var select = document.getElementById('cartridgeTypeSelect');
    select.value = cartridgeType;
}

// Gets hex data based on cartridge type selected
function getCartridgeType() {
    var select = document.getElementById('cartridgeTypeSelect');
    return select.value;
}

// Sets the ROM size based on hex data
function setRomSize(romSize) {
    var select = document.getElementById('romSizeSelect');
    select.value = romSize;
}

// Gets hex data based on ROM selection
function getRomSize() {
    var select = document.getElementById('romSizeSelect');
    return select.value;
}

// Sets the RAM size select box based on hex data
function setRamSize(ramSize) {
    var select = document.getElementById('ramSizeSelect');
    select.value = ramSize;
}

// Gets hex data based on the RAM size select box
function getRamSize() {
    var select = document.getElementById('ramSizeSelect');
    return select.value;
}

// Sets the destination checkbox based on hex data
function setDestinationCode(destinationCode) {
    var select = document.getElementById('destinationSelect');
    select.value = destinationCode;
}

// Gets hex data based on the destination checkbox
function getDestinationCode() {
    var select = document.getElementById('destinationSelect');
    return select.value;
}

// Gets the old licnesee code hex based on the old licnesee input
function getOldLicenseeCode() {
    var text = document.getElementById('oldLicenseeInput').value;
    // Do checks
    if (text.length == 2 && text.isValidHexString()) {
        return text;
    } else if (text.length == 0) {
        return "00";
    } else {
        return null;
    }
}

// Gets the rom verion number hex based on the version number input
function getRomVersionNumber() {
    var text = document.getElementById('versionNumberInput').value;
    // Do checks
    if (text.length == 2 && text.isValidHexString()) {
        return text;
    } else if (text.length == 0) {
        return "00";
    } else {
        return null;
    }
}

// Retrieves the values of all fields and concatenates them into a single hex string
// If there are any errors, simply displays a popupbox instead and returns "NULL"
function getFieldValues() {
    var hexData = "";
    var errorString = "";

    if (currentMode === 'gba') {
        var title = getTitle();
        var gameCode = getManufacturerCode(); // Reuse manufacturer input
        var makerCode = getNewLicenseeCode(); // Reuse new licensee input
        var version = getRomVersionNumber();

        if (title === null) errorString += "Input for title was invalid\n";
        if (gameCode === null) errorString += "Input for Game Code was invalid\n";
        if (makerCode === null) errorString += "Input for Maker Code was invalid\n";
        if (version === null) errorString += "Input for version was invalid\n";

        if (errorString !== "") {
            document.getElementById('alertModalBody').innerText = errorString;
            $('#alertModal').modal();
            return null;
        }

        hexData += title;
        hexData += gameCode;
        hexData += makerCode;
        hexData += "96"; // Fixed
        hexData += "00"; // Main Unit
        hexData += "00"; // Device Type
        hexData += "00000000000000"; // Reserved 7 bytes
        hexData += version;
        return hexData;
    } else {
        // First get data
        var title = getTitle();
        var manufacturerCode = getManufacturerCode();
        var cgbFlag = getCGBFlag();
        var newLicenseeCode = getNewLicenseeCode();
        var sgbFlag = getSGBFlag();
        var cartridgeType = getCartridgeType();
        var romSize = getRomSize();
        var ramSize = getRamSize();
        var destinationCode = getDestinationCode();
        var oldLicenseeCode = getOldLicenseeCode();
        var romVersionNumber = getRomVersionNumber();
        
        // Check for invalid inputs
        if (title === null) {
            errorString = "Input for title was invalid\n";
        }
        if (manufacturerCode === null) {
            errorString += "Input for manufacturer code was invalid\n";
        }
        if (cgbFlag === null) {
            errorString += "Input for cgb flag was invalid\n";
        }
        if (newLicenseeCode === null) {
            errorString += "Input for new licensee code was invalid\n";
        }
        if (sgbFlag === null) {
            errorString += "Input for sgb flag was invalid\n";
        }
        if (cartridgeType === null) {
            errorString += "Input for cartridge type was invalid\n";
        }
        if (romSize === null) {
            errorString += "Input for rom size was invalid\n";
        }
        if (ramSize === null) {
            errorString += "Input for ram size was invalid\n";
        }
        if (destinationCode === null) {
            errorString += "Input for destination code was invalid\n";
        }
        if (oldLicenseeCode === null) {
            errorString += "Input for old licensee code was invalid\n";
        }
        if (romVersionNumber === null) {
            errorString += "Input for rom version number was invalid\n";
        }
        if (errorString !== "") {
            document.getElementById('alertModalBody').innerText = errorString;
            $('#alertModal').modal();
            // alert(errorString);
            return null;
        } else {
            hexData += title;
            hexData += manufacturerCode;
            hexData += cgbFlag;
            hexData += newLicenseeCode;
            hexData += sgbFlag;
            hexData += cartridgeType;
            hexData += romSize;
            hexData += ramSize;
            hexData += destinationCode;
            hexData += oldLicenseeCode;
            hexData += romVersionNumber;
            return hexData;
        }
    }
}

function calculateGBAHeaderChecksum(hexString) {
    var checksum = 0;
    // hexString contains the bytes
    for (var i = 0; i < hexString.length; i += 2) {
        var byte = parseInt("0x" + hexString.substr(i, 2));
        checksum = (checksum - byte) & 0xFF;
    }
    checksum = (checksum - 0x19) & 0xFF;
    // Convert to hex and ensure 2 chars
    var hex = checksum.toString(16).toUpperCase();
    if (hex.length < 2) hex = "0" + hex;
    return hex;
}

/*
//
// MODIFICATIONS TO STRING CLASS
//
*/

// Gets the ASCII equivalent of two hex characters
String.prototype.getASCIIFromHex = function() {
    returnString = "";
    // read the hex string two characters at a time
    for (i = 0; i < this.length; i += 2) {
        // ignore 00 ASCII characters
        if (this.substr(i, 2) !== "00") {
            returnString += String.fromCharCode(parseInt(this.substr(i, 2), 16));
        }
    }
    return returnString;
}

// Encodes a (UNICODE?) string to hex values
String.prototype.hexEncode = function() {
    var hex, i;

    var result = "";
    for (i = 0; i < this.length; i++) {
        // hex will be a hex character, but could possibly be only one digit when we need it to be two
        hex = this.charCodeAt(i).toString(16).toUpperCase();
        if (hex.length == 1) {
            result += "0";
        }
        result += hex;
    }
    return result
}

String.prototype.isValidASCII = function() {
    return /^[\x00-\x7F]*$/.test(this);
}

String.prototype.toHexString = function() {
    var returnString = "";
    for (i = 0; i < this.length; i++) {
        returnString += this.charCodeAt(i).toString(16).toUpperCase();
    }
    return returnString;
}

// Checks if a decimal integer can be converted to a hex value
String.prototype.isValidHexString = function() {
    var validValues = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "A", "B", "C", "D", "E", "F"];
    // go through the entire string
    for (i = 0; i < this.length; i++) {
        // check each character in string against array
        for (k = 0; k < validValues.length; k++) {
            // if a match is found get out of loop
            if (validValues[k] === this.charAt(i)) {
                break;
            }
        }
        // if the characters match then restart loop
        if (validValues[k] === this.charAt(i)) {
            break;
        }
        return false;
    }
    return true;
}
