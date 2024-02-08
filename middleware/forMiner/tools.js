//this reverse a String
function reverser(esreveRrts) {
    var j = esreveRrts.length 
let strReverse = "";
        while ( j != -1 ) {
        strReverse  += esreveRrts.charAt(j);
        j = j - 1;
        }
    return strReverse
    }

//find a string looking forward from data startingString until endSign    
function afterUntil(data, debutString, endSign) {
    let debutForward = data.search(debutString) + debutString.length;
    let forWardString = "";
       var i = 0;
    while (data.slice(debutForward + i, debutForward + i + 1) != endSign) {
        forWardString += data.slice(debutForward + i, debutForward + i +1);
        i++;
    };
    return forWardString;
}

//find a string in reverse form from data ending with endString and starting with endSign    
function backWard(data, endString, endSign) {
    let reverseEnd = data.search(endString);
    let draWkcab = reverser(endString);
    var i = 0;
    while (data.slice(reverseEnd - 1 - i, reverseEnd - i) != endSign) {
        draWkcab += data.slice(reverseEnd - 1 - i, reverseEnd - i);
        i++;
    };
    return draWkcab;
}

function inBetween(data, debut, fin) {
    var d = data.search(debut) + debut.length;        
    var f = data.search(fin);
    return data.slice(d,f);
}

function inBetweenEvol(data, debut, fin) {
    var d = data.search(debut) + debut.length;        
    var remain = data.slice(d, data.length);
    var f = d + remain.search(fin);
    return data.slice(d,f);
}

function inBetweenLong(data, debut, l) {
    var d = data.search(debut) + debut.length;        
    return data.slice(d, d+l);
}

function startWithLong(data, startWith, l) {
    var d = data.search(startWith) + startWith.length;        
    var f = d + l;
    return (startWith + data.slice(d,f));
}

//cut a string, looking backward from data until endSign , and keeps what is before, end sign is included
function beforeUntil(data, endSign) {
    let totalLength = data.length;
       var i = 0;
    while (data.slice(totalLength - i - 1, totalLength - i) != endSign) {
        beforeSign = data.slice(0, totalLength - i-1);
        i++;
    };
    return beforeSign;
}



module.exports = { reverser , afterUntil, backWard, inBetween, inBetweenEvol, inBetweenLong, startWithLong, beforeUntil };
