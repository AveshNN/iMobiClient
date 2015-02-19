function ValidateBarcode(Barcode) {
    Barcode = $.trim(Barcode);
    var scannedBarcode = Barcode;
    
    if (Barcode.length == 8) {
        
        if (ValidateBarcodeType(Barcode, "EU")) {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        if (Barcode.length < 12) {
            return false;
        }
    
        var valTypeChar = Barcode.substring(6, 7);
        if ($.isNumeric(valTypeChar)) {
            if (Barcode.length == 13) {
                if (ValidateBarcodeType(Barcode, "CM") == scannedBarcode.substr(scannedBarcode.length - 1)) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                if (ValidateBarcodeType(Barcode, "EAM") == scannedBarcode.substr(scannedBarcode.length - 1)) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        else {
            if (ValidateBarcodeType(Barcode, "EAM") == scannedBarcode.substr(scannedBarcode.length - 1)) {
                return true;
            }
            else {
                return false;
            }
        }
    }
}

function ValidateBarcodeType(Barcode, type) {
    if (type == "EAM") {
        return EAMValidateBarcode(Barcode);
    }
    else {
        if (type == "CM") {
            return CMValidateBarcode(Barcode);
        } 
        else {
            if (type == "EU") {
                return EUValidateBarcode(Barcode);
            }
        }
    }
}

function EUValidateBarcode(Barcode) {
    if ($.isNumeric(Barcode)) {
        return true;
    }
    else {
        return false;
    }
}

function EAMValidateBarcode(Barcode) {
    var barcodeInChar = Barcode.split("");
    
    var sum = 0;
    var cnt = 9;
    
    for (var i = 0; i < barcodeInChar.length && i < 11; i++) {
        var chr = barcodeInChar[i].charCodeAt(0);
        sum += (parseInt(chr) > 64 ? parseInt(chr) - 55 : parseInt(String.fromCharCode(chr))) * cnt;
        cnt--;
        if (cnt == 1)
            cnt = 9;
    }
    var chkval = sum % 35;
    var checkDigit = chkval > 9 ? String.fromCharCode(chkval + 55) : chkval;
    return checkDigit;
}

function CMValidateBarcode(Barcode) {
    if (Barcode.length != 13) {
        return "!";
    }
    
    var valTypeChar = Barcode.substring(6, 12);
    if ($.isNumeric(valTypeChar) == false) {
        return "!";
    }
    
    Barcode = Barcode.substring(0, 12);
    var barcodeInChar = Barcode.split("");
    
    var sum = 0;
    
    for (var i = 0; i < barcodeInChar.length && i < 12; i++) {
        var chr = barcodeInChar[i].charCodeAt(0);
        ival = (parseInt(chr) > 64 ? parseInt(chr) - 55 : parseInt(String.fromCharCode(chr)));
        
        if (ival < 0) {
            switch (chr) {
                case '-':
                    ival = 36;
                    break;
                case '.':
                    ival = 37;
                    break;
                case ' ':
                    ival = 38;
                    break;
                case '$':
                    ival = 39;
                    break;
                case '/':
                    ival = 40;
                    break;
                case '+':
                    ival = 41;
                    break;
                case '%':
                    ival = 42;
                    break;
            }
        }
        
        sum += ival;
    }
    var chkval = sum % 43;
    if (chkval > 35) {
        return "!";
    }
    
    var checkDigit = chkval > 9 ? String.fromCharCode(chkval + 55) : chkval;
    return checkDigit;
}